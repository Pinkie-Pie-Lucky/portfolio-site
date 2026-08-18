"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import AuthModal from "./AuthModal";

type Role = "admin" | "editor" | "visitor";

export default function NavAuth() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("auth") === "login") {
      setShowAuth(true);
    }
  }, [searchParams]);

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

  return (
    <>
      {!isAuthed ? (
        <button className="nav-auth" onClick={() => setShowAuth(true)}>
          登录
        </button>
      ) : role === "visitor" ? (
        <button className="nav-auth" onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? "退出中…" : "退出登录"}
        </button>
      ) : (
        <Link href="/admin">管理</Link>
      )}
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
