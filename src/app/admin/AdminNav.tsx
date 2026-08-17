"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="admin-nav" aria-label="管理后台导航">
      <Link
        className={pathname === "/admin/works" ? "is-active" : ""}
        href="/admin/works"
      >
        作品管理
      </Link>
      <Link
        className={pathname === "/admin/creates" ? "is-active" : ""}
        href="/admin/creates"
      >
        创作管理
      </Link>
      {isAdmin && (
        <Link
          className={pathname === "/admin/users" ? "is-active" : ""}
          href="/admin/users"
        >
          用户管理
        </Link>
      )}
      <span className="admin-nav__logout">
        <button onClick={handleLogout} className="btn btn--ghost">
          退出登录
        </button>
      </span>
    </nav>
  );
}
