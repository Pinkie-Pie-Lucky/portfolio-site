"use client";

import { useEffect, useState, useCallback } from "react";

interface CreateItem {
  id: string;
  title: string;
  image: string | null;
  caption: string;
  order: number;
}

const EMPTY = { title: "", image: "", caption: "", order: 0 };

export default function CreatesAdminPage() {
  const [creates, setCreates] = useState<CreateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/creates");
      if (!res.ok) throw new Error("加载失败");
      const data = await res.json();
      setCreates(data.creates);
    } catch {
      setError("加载创作列表失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMsg("");
    const payload = { ...form, image: form.image || null };
    try {
      const url = editingId
        ? `/api/admin/creates/${editingId}`
        : "/api/admin/creates";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "保存失败");
        return;
      }
      setMsg(editingId ? "已更新" : "已创建");
      setForm(EMPTY);
      setEditingId(null);
      load();
    } catch {
      setError("网络错误");
    }
  }

  function startEdit(c: CreateItem) {
    setEditingId(c.id);
    setForm({
      title: c.title,
      image: c.image || "",
      caption: c.caption,
      order: c.order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!window.confirm("确认删除该创作条目？")) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/creates/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "删除失败");
        return;
      }
      setMsg("已删除");
      if (editingId === id) {
        setEditingId(null);
        setForm(EMPTY);
      }
      load();
    } catch {
      setError("网络错误");
    }
  }

  return (
    <div>
      {error && <p className="auth-error">{error}</p>}
      {msg && <p className="admin-ok">{msg}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2 className="admin-form__title">
          {editingId ? "编辑创作条目" : "新建创作条目"}
        </h2>
        <div className="field">
          <label htmlFor="ctitle">标题</label>
          <input
            id="ctitle"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="cimage">图片路径</label>
          <input
            id="cimage"
            type="text"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="/assets/img/create-xxx.jpg"
          />
        </div>
        <div className="field">
          <label htmlFor="ccaption">说明</label>
          <textarea
            id="ccaption"
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
            rows={2}
          />
        </div>
        <div style={{ marginTop: "var(--sp-4)" }}>
          <button className="btn btn--primary" type="submit">
            {editingId ? "保存修改" : "创建"}
          </button>
          {editingId && (
            <button
              className="btn btn--ghost"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY);
              }}
              style={{ marginLeft: "var(--sp-2)" }}
            >
              取消
            </button>
          )}
        </div>
      </form>

      <div className="admin-list">
        <div className="admin-list__head">
          <span>标题</span>
          <span>图片</span>
          <span>操作</span>
        </div>
        {loading && <p className="muted">加载中…</p>}
        {!loading &&
          creates.map((c) => (
            <div className="admin-list__row" key={c.id}>
              <span className="admin-list__email">{c.title}</span>
              <span className="muted">{c.image || "—"}</span>
              <span className="admin-list__actions">
                <button className="btn btn--ghost btn--sm" onClick={() => startEdit(c)}>
                  编辑
                </button>
                <button className="btn btn--ghost btn--sm" onClick={() => handleDelete(c.id)}>
                  删除
                </button>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
