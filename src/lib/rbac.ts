import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, UserStatus } from "@/generated/prisma/enums";

export type { Role };

const ROLE_LEVEL: Record<Role, number> = {
  visitor: 0,
  editor: 1,
  admin: 2,
};

export function roleAtLeast(role: Role, required: Role): boolean {
  return ROLE_LEVEL[role] >= ROLE_LEVEL[required];
}

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
};

export async function getSessionUser(headers: Headers): Promise<SessionUser | null> {
  const session = await auth.api.getSession({
    headers,
  });
  if (!session) return null;

  const sessionUser = session.user as { id: string; email: string };
  if (!sessionUser?.id) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { id: true, email: true, role: true, status: true },
  });
  if (!dbUser) return null;

  if (dbUser.status !== "active") return null;

  return {
    id: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
    status: dbUser.status,
  };
}

export class UnauthorizedError extends Error {}
export class ForbiddenError extends Error {}

export async function requireRole(
  headers: Headers,
  required: Role,
): Promise<SessionUser> {
  const user = await getSessionUser(headers);
  if (!user) throw new UnauthorizedError("未登录或会话已失效");
  if (!roleAtLeast(user.role, required)) {
    throw new ForbiddenError("权限不足");
  }
  return user;
}
