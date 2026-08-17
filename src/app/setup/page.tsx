"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    fetch("/api/setup")
      .then((r) => r.json())
      .then((d) => {
        setNeedsSetup(Boolean(d.needsSetup));
        if (!d.needsSetup) router.push("/admin");
      })
      .catch(() => setError("网络错误"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "初始化失败");
        return;
      }
      router.push("/login");
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="auth-wrap">
        <div className="auth-card">
          <p className="muted">检查中…</p>
        </div>
      </div>
    );
  }

  if (!needsSetup) return null;

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <p className="eyebrow">首次初始化</p>
        <h1 className="section-title" style={{ marginTop: "var(--sp-2)" }}>
          创建管理员
        </h1>
        <p className="muted" style={{ marginTop: "var(--sp-2)" }}>
          系统尚无任何用户，请创建第一个管理员账号。
        </p>
        <form
          className="contact-form"
          onSubmit={handleSubmit}
          style={{ marginTop: "var(--sp-5)" }}
        >
          <div className="field">
            <label htmlFor="semail">邮箱</label>
            <input
              id="semail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@xx.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="spass">密码</label>
            <input
              id="spass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 8 位"
              autoComplete="new-password"
              required
            />
          </div>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="btn btn--primary btn--lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "创建中…" : "创建管理员 →"}
          </button>
        </form>
      </div>
    </div>
  );
}
