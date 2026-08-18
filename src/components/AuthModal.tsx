"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export default function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await fetch("/api/auth/sign-in/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || data.error || "登录失败");
          return;
        }
        onClose();
        router.refresh();
        if (data?.user?.role !== "visitor") {
          router.push("/admin");
        }
      } else {
        const res = await fetch("/api/auth/sign-up/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || data.error || "注册失败");
          return;
        }
        onClose();
        router.refresh();
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setPassword("");
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="auth-card modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={mode === "login" ? "登录" : "注册"}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="关闭"
          onClick={onClose}
        >
          ✕
        </button>

        <p className="eyebrow">管理后台</p>
        <h2 className="section-title" style={{ marginTop: "var(--sp-2)" }}>
          {mode === "login" ? "登录" : "注册"}
        </h2>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={mode === "login" ? "active" : ""}
            onClick={() => switchMode("login")}
          >
            登录
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={mode === "register" ? "active" : ""}
            onClick={() => switchMode("register")}
          >
            注册
          </button>
        </div>

        <form
          className="contact-form"
          onSubmit={handleSubmit}
          style={{ marginTop: "var(--sp-5)" }}
        >
          {mode === "register" && (
            <div className="field">
              <label htmlFor="modal-name">昵称</label>
              <input
                id="modal-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="怎么称呼你"
                autoComplete="name"
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="modal-email">邮箱</label>
            <input
              id="modal-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@xx.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="modal-password">密码</label>
            <input
              id="modal-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
          </div>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn--primary btn--lg" type="submit" disabled={loading}>
            {loading
              ? mode === "login"
                ? "登录中…"
                : "注册中…"
              : mode === "login"
                ? "登录 →"
                : "注册 →"}
          </button>
        </form>

        <p className="auth-hint">
          游客无须注册，直接浏览本站作品与创作即可。注册账号用于参与互动。
        </p>
      </div>
    </div>
  );
}
