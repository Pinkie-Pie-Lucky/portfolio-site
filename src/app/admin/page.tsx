import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/rbac";

export default async function AdminHomePage() {
  const h = await headers();
  const user = await getSessionUser(h);
  if (!user) redirect("/login");

  return (
    <div>
      <p className="muted">
        欢迎回来。使用上方导航管理作品、创作内容
        {user.role === "admin" ? "与用户" : ""}。
      </p>
    </div>
  );
}
