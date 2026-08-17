import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, UnauthorizedError, ForbiddenError } from "@/lib/rbac";
import { Role, UserStatus } from "@/generated/prisma/enums";
import { hashPassword } from "better-auth/crypto";

const VALID_ROLES: Role[] = ["admin", "editor", "visitor"];
const VALID_STATUSES: UserStatus[] = ["active", "disabled"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const current = await requireRole(req.headers, "admin");
    const { id } = await params;

    const body = await req.json();
    const role = VALID_ROLES.includes(body.role) ? (body.role as Role) : undefined;
    const status = VALID_STATUSES.includes(body.status)
      ? (body.status as UserStatus)
      : undefined;
    const password = typeof body.password === "string" ? body.password : undefined;
    const name = typeof body.name === "string" ? body.name.trim() : undefined;

    const hasUpdates =
      role !== undefined ||
      status !== undefined ||
      password !== undefined ||
      name !== undefined;
    if (!hasUpdates) {
      return NextResponse.json({ error: "没有可更新的字段" }, { status: 400 });
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    if (id === current.id) {
      if (role && role !== "admin") {
        return NextResponse.json(
          { error: "不能降低自己的角色" },
          { status: 422 },
        );
      }
      if (status === "disabled") {
        return NextResponse.json(
          { error: "不能停用自己的账号" },
          { status: 422 },
        );
      }
    }

    const activeAdminCount = await prisma.user.count({
      where: { role: "admin", status: "active" },
    });
    const wouldDisableAdmin =
      target.role === "admin" &&
      (status === "disabled" || (role && role !== "admin"));
    if (wouldDisableAdmin && activeAdminCount <= 1) {
      return NextResponse.json(
        { error: "至少保留一个启用的管理员" },
        { status: 422 },
      );
    }

    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: "密码长度至少 8 位" },
          { status: 400 },
        );
      }
      const passwordHash = await hashPassword(password);
      await prisma.account.updateMany({
        where: { userId: id, providerId: "credential" },
        data: { password: passwordHash },
      });
    }

    const data: { role?: Role; status?: UserStatus; name?: string } = {};
    if (role) data.role = role;
    if (status) data.status = status;
    if (name !== undefined) data.name = name;

    let user = null;
    if (Object.keys(data).length > 0) {
      user = await prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });
    }

    return NextResponse.json({ user });
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    if (e instanceof ForbiddenError) {
      return NextResponse.json({ error: e.message }, { status: 403 });
    }
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
