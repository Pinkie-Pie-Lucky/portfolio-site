"use client";

import { useEffect, useState, useCallback } from "react";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  createdAt: string;
}

type Role = "admin" | "editor" | "visitor";

const ROLE_LABEL: Record<Role, string> = {
  admin: "管理员",
  editor: "编辑",
  visitor: "访客",
};

export default function UsersAdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<Role>("editor");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.status === 403) {
        setError("无权限访问用户管理");
        setUsers([]);
        return;
      }
      if (!res.ok) throw new Error("加载失败");
      const data = await res.json();
      setUsers(data.users);
      setError("");
    } catch {
      setError("加载用户列表失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setError("");
    if (!newEmail || !newPassword) {
      setError("邮箱与密码为必填项");
      return;
    }
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          name: newName,
          role: newRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "创建失败");
        return;
      }
      setMsg("用户已创建");
      setNewEmail("");
      setNewPassword("");
      setNewName("");
      load();
    } catch {
      setError("网络错误");
    }
  }

  async function handleUpdate(
    id: string,
    patch: { role?: Role; status?: "active" | "disabled" },
  ) {
    setError("");
    setMsg("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "更新失败");
        return;
      }
      setMsg("已更新");
      load();
    } catch {
      setError("网络错误");
    }
  }

  return (
    <div>
      {error && <p className="auth-error">{error}</p>}
      {msg && <p className="admin-ok">{msg}</p>}

      <form className="admin-form" onSubmit={handleCreate}>
        <h2 className="admin-form__title">创建用户</h2>
        <div className="admin-form__row">
          <div className="field">
            <label htmlFor="nemail">邮箱</label>
            <input
              id="nemail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="you@xx.com"
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="npass">初始密码</label>
            <input
              id="npass"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="至少 8 位"
              autoComplete="new-password"
            />
          </div>
          <div className="field">
            <label htmlFor="nname">昵称（可选）</label>
            <input
              id="nname"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="怎么称呼"
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="nrole">角色</label>
            <select
              id="nrole"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as Role)}
            >
              <option value="editor">编辑</option>
              <option value="visitor">访客</option>
            </select>
          </div>
          <div className="field">
            <button className="btn btn--primary" type="submit">
              创建
            </button>
          </div>
        </div>
      </form>

      <div className="admin-list">
        <div className="admin-list__head">
          <span>昵称</span>
          <span>邮箱</span>
          <span>角色</span>
          <span>状态</span>
          <span>操作</span>
        </div>
        {loading && <p className="muted">加载中…</p>}
        {!loading &&
          users.map((u) => (
            <div className="admin-list__row" key={u.id}>
              <span className="admin-list__email">
                {u.name || <span className="muted">—</span>}
              </span>
              <span className="admin-list__email">
                {u.email}
                {u.role === "admin" && <em>管理员</em>}
              </span>
              <span>
                <select
                  value={u.role}
                  onChange={(e) =>
                    handleUpdate(u.id, { role: e.target.value as Role })
                  }
                >
                  <option value="admin">管理员</option>
                  <option value="editor">编辑</option>
                  <option value="visitor">访客</option>
                </select>
              </span>
              <span>
                {u.status === "active" ? (
                  <span className="tag">启用</span>
                ) : (
                  <span className="tag tag--off">停用</span>
                )}
              </span>
              <span>
                {u.status === "active" ? (
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() =>
                      handleUpdate(u.id, { status: "disabled" })
                    }
                  >
                    停用
                  </button>
                ) : (
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => handleUpdate(u.id, { status: "active" })}
                  >
                    启用
                  </button>
                )}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
