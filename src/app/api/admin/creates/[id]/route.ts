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

    const existing = await prisma.create.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "创作条目不存在" }, { status: 404 });
    }

    const body = await req.json();
    const data: {
      title?: string;
      image?: string | null;
      caption?: string;
      order?: number;
    } = {};

    if (typeof body.title === "string") data.title = body.title.trim();
    if (typeof body.image === "string") data.image = body.image;
    if (typeof body.caption === "string") data.caption = body.caption;
    if (typeof body.order === "number") data.order = body.order;

    const create = await prisma.create.update({ where: { id }, data });
    return NextResponse.json({ create });
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

    const existing = await prisma.create.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "创作条目不存在" }, { status: 404 });
    }

    await prisma.create.delete({ where: { id } });
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
