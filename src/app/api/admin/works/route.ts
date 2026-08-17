import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireRole,
  getSessionUser,
  UnauthorizedError,
  ForbiddenError,
} from "@/lib/rbac";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req.headers);
    const where = user ? {} : { published: true };
    const works = await prisma.work.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ works });
  } catch (e) {
    if (e instanceof UnauthorizedError || e instanceof ForbiddenError) {
      return NextResponse.json({ error: (e as Error).message }, { status: 401 });
    }
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(req.headers, "editor");
    const body = await req.json();
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (!slug || !title) {
      return NextResponse.json(
        { error: "slug 与标题为必填项" },
        { status: 400 },
      );
    }

    const existing = await prisma.work.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "slug 已存在" }, { status: 409 });
    }

    const work = await prisma.work.create({
      data: {
        slug,
        title,
        summary: typeof body.summary === "string" ? body.summary : "",
        coverImage: typeof body.coverImage === "string" ? body.coverImage : null,
        body: typeof body.body === "string" ? body.body : "",
        tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : "[]",
        published: Boolean(body.published),
        order: typeof body.order === "number" ? body.order : 0,
      },
    });
    return NextResponse.json({ work }, { status: 201 });
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
