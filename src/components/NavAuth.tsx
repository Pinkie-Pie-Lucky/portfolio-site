"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function NavAuth() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    authClient
      .getSession()
      .then(({ data }) => {
        if (mounted) setIsAuthed(Boolean(data?.session));
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return isAuthed ? (
    <Link href="/admin">管理</Link>
  ) : (
    <Link href="/login">登录</Link>
  );
}
