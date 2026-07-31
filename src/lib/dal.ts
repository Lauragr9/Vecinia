import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/enums";

export const getSession = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session;
});

export const getMemberships = cache(async () => {
  const session = await getSession();
  return prisma.membership.findMany({
    where: { userId: session.user.id },
    include: { comunidad: true },
    orderBy: { comunidad: { nombre: "asc" } },
  });
});

export const isAdminAnywhere = cache(async () => {
  const memberships = await getMemberships();
  return memberships.some((m) => m.role === "ADMIN");
});

export async function requireMembership(comunidadId: string, roles?: Role[]) {
  const session = await getSession();
  const membership = await prisma.membership.findUnique({
    where: { userId_comunidadId: { userId: session.user.id, comunidadId } },
  });

  if (!membership) {
    redirect("/");
  }

  if (roles && !roles.includes(membership.role)) {
    redirect("/");
  }

  return { session, membership };
}

export async function requireAdmin(comunidadId: string) {
  return requireMembership(comunidadId, ["ADMIN"]);
}

export const getPortalMembership = cache(async () => {
  const memberships = await getMemberships();
  const membership = memberships.find((m) => m.role !== "ADMIN") ?? memberships[0];
  if (!membership) {
    redirect("/login");
  }
  return membership;
});

export const getMisUnidades = cache(async (comunidadId: string) => {
  const session = await getSession();
  return prisma.unidad.findMany({
    where: {
      edificio: { comunidadId },
      OR: [{ propietarioId: session.user.id }, { inquilinoId: session.user.id }],
    },
    orderBy: { identificador: "asc" },
  });
});
