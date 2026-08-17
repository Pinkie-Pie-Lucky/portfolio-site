import { headers } from "next/headers";
import { getSessionUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function getPublicWorks() {
  const h = await headers();
  const user = await getSessionUser(h);
  const where = user ? {} : { published: true };
  return prisma.work.findMany({
    where,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getPublicCreates() {
  return prisma.create.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getWorkBySlug(slug: string) {
  const h = await headers();
  const user = await getSessionUser(h);
  const work = await prisma.work.findUnique({
    where: { slug },
  });
  if (!work) return null;
  if (!work.published && !user) return null;
  return work;
}

export async function getFeaturedWorks() {
  const works = await getPublicWorks();
  return works.slice(0, 4);
}
