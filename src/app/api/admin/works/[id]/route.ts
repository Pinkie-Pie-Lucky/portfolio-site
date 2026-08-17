import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, UnauthorizedError, ForbiddenError } from "@/lib/rbac";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(req.headers, "editor");
    const { id } = await params;

    const existing = await prisma.work.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "作品不存在" }, { status: 404 });
    }

    const body = await req.json();
    const slug = typeof body.slug === "string" ? body.slug.trim() : undefined;

    if (slug !== undefined && slug !== existing.slug) {
      const dup = await prisma.work.findUnique({ where: { slug } });
      if (dup && dup.id !== id) {
        return NextResponse.json({ error: "slug 已存在" }, { status: 409 });
      }
    }

    const data: {
      slug?: string;
      title?: string;
      summary?: string;
      coverImage?: string | null;
      body?: string;
      tags?: string;
      published?: boolean;
      order?: number;
    } = {};

    if (slug !== undefined) data.slug = slug;
    if (typeof body.title === "string") data.title = body.title.trim();
    if (typeof body.summary === "string") data.summary = body.summary;
    if (typeof body.coverImage === "string") data.coverImage = body.coverImage;
    if (Array.isArray(body.tags)) data.tags = JSON.stringify(body.tags);
    if (typeof body.body === "string") data.body = body.body;
    if (typeof body.published === "boolean") data.published = body.published;
    if (typeof body.order === "number") data.order = body.order;

    const work = await prisma.work.update({ where: { id }, data });
    return NextResponse.json({ work });
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(req.headers, "editor");
    const { id } = await params;

    const existing = await prisma.work.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "作品不存在" }, { status: 404 });
    }

    await prisma.work.delete({ where: { id } });
    return NextResponse.json({ ok: true });
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
