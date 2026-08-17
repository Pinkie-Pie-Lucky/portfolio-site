"use client";

import { useEffect, useState, useCallback } from "react";

interface WorkItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImage: string | null;
  body: string;
  tags: string;
  published: boolean;
  order: number;
}

const EMPTY = {
  slug: "",
  title: "",
  summary: "",
  coverImage: "",
  body: "",
  tags: "",
  published: false,
  order: 0,
};

export default function WorksAdminPage() {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/works");
      if (!res.ok) throw new Error("加载失败");
      const data = await res.json();
      setWorks(data.works);
    } catch {
      setError("加载作品列表失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function parseTags(raw: string): string[] {
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return raw ? raw.split(",").map((t) => t.trim()).filter(Boolean) : [];
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMsg("");
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      coverImage: form.coverImage || null,
    };
    try {
      const url = editingId
        ? `/api/admin/works/${editingId}`
        : "/api/admin/works";
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
      setMsg(editingId ? "作品已更新" : "作品已创建");
      setForm(EMPTY);
      setEditingId(null);
      load();
    } catch {
      setError("网络错误");
    }
  }

  function startEdit(w: WorkItem) {
    setEditingId(w.id);
    setForm({
      slug: w.slug,
      title: w.title,
      summary: w.summary,
      coverImage: w.coverImage || "",
      body: w.body,
      tags: parseTags(w.tags).join(", "),
      published: w.published,
      order: w.order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!window.confirm("确认删除该作品？")) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/works/${id}`, { method: "DELETE" });
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

  async function togglePublish(w: WorkItem) {
    setError("");
    try {
      const res = await fetch(`/api/admin/works/${w.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !w.published }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "更新失败");
        return;
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
          {editingId ? "编辑作品" : "新建作品"}
        </h2>
        <div className="field">
          <label htmlFor="wtitle">标题</label>
          <input
            id="wtitle"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="wslug">Slug（URL 标识，如 paopao）</label>
          <input
            id="wslug"
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="wsummary">简介</label>
          <textarea
            id="wsummary"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={2}
          />
        </div>
        <div className="field">
          <label htmlFor="wcover">封面图路径</label>
          <input
            id="wcover"
            type="text"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            placeholder="/assets/img/shot-xxx.png"
          />
        </div>
        <div className="field">
          <label htmlFor="wtags">标签（逗号分隔）</label>
          <input
            id="wtags"
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="wbody">正文</label>
          <textarea
            id="wbody"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={6}
          />
        </div>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          发布（公开可见）
        </label>
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
          <span>Slug</span>
          <span>状态</span>
          <span>操作</span>
        </div>
        {loading && <p className="muted">加载中…</p>}
        {!loading &&
          works.map((w) => (
            <div className="admin-list__row" key={w.id}>
              <span className="admin-list__email">{w.title}</span>
              <span className="muted">{w.slug}</span>
              <span>
                {w.published ? (
                  <button
                    className="tag"
                    onClick={() => togglePublish(w)}
                    title="点击设为未发布"
                  >
                    已发布
                  </button>
                ) : (
                  <button
                    className="tag tag--off"
                    onClick={() => togglePublish(w)}
                    title="点击发布"
                  >
                    草稿
                  </button>
                )}
              </span>
              <span className="admin-list__actions">
                <button className="btn btn--ghost btn--sm" onClick={() => startEdit(w)}>
                  编辑
                </button>
                <button className="btn btn--ghost btn--sm" onClick={() => handleDelete(w.id)}>
                  删除
                </button>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
