import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/rbac";
import AdminNav from "./AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const user = await getSessionUser(h);

  if (!user) {
    redirect("/login");
  }

  if (user.role === "visitor") {
    redirect("/");
  }

  const isAdmin = user.role === "admin";

  return (
    <main>
      <section
        className="section"
        style={{ paddingTop: "calc(var(--nav-h) + var(--sp-8))" }}
      >
        <div className="container" style={{ maxWidth: "var(--container-narrow)" }}>
          <div className="admin-head">
            <div>
              <p className="eyebrow">管理后台</p>
              <h1 className="section-title" style={{ fontSize: "var(--fs-3xl)" }}>
                {user.email}
              </h1>
              <p className="muted">角色：{user.role}</p>
            </div>
          </div>
          <AdminNav isAdmin={isAdmin} />
          <div style={{ marginTop: "var(--sp-6)" }}>{children}</div>
        </div>
      </section>
    </main>
  );
}
