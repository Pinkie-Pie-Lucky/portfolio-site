"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type Role = "admin" | "editor" | "visitor";

export default function NavAuth() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;
    authClient
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setIsAuthed(Boolean(data?.session));
        setRole((data?.user?.role as Role) ?? null);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/sign-out", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    setIsAuthed(false);
    setRole(null);
    setLoggingOut(false);
  }

  if (!isAuthed) {
    return <Link href="/login">登录</Link>;
  }

  if (role === "visitor") {
    return (
      <button className="nav-auth" onClick={handleLogout} disabled={loggingOut}>
        {loggingOut ? "退出中…" : "退出登录"}
      </button>
    );
  }

  return <Link href="/admin">管理</Link>;
}
