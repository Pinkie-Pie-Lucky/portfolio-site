import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req.headers);
    const where = user ? {} : { published: true };

    const [works, creates] = await Promise.all([
      prisma.work.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.create.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
    ]);

    return NextResponse.json({ works, creates });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
