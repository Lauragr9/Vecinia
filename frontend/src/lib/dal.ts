import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { apiGet, ApiError } from "@/lib/api-client";
import type { Membership, Role, Unidad, User } from "@/types/api";

interface MeResponse {
  user: User;
  memberships: Membership[];
}

export const getSession = cache(async (): Promise<MeResponse> => {
  try {
    return await apiGet<MeResponse>("/api/auth/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login");
    }
    throw error;
  }
});

export const getMemberships = cache(async (): Promise<Membership[]> => {
  const session = await getSession();
  return session.memberships;
});

export async function requireMembership(comunidadId: string, roles?: Role[]) {
  const memberships = await getMemberships();
  const membership = memberships.find((m) => m.comunidadId === comunidadId);

  if (!membership) {
    redirect("/");
  }
  if (roles && !roles.includes(membership.role)) {
    redirect("/");
  }

  return membership;
}

export async function requireAdmin(comunidadId: string) {
  return requireMembership(comunidadId, ["ADMIN"]);
}

export const getPortalMembership = cache(async (): Promise<Membership> => {
  const memberships = await getMemberships();
  const membership = memberships.find((m) => m.role !== "ADMIN") ?? memberships[0];
  if (!membership) {
    redirect("/");
  }
  return membership;
});

export const getMisUnidades = cache(async (comunidadId: string): Promise<Unidad[]> => {
  return apiGet<Unidad[]>(`/api/comunidades/${comunidadId}/mis-unidades`);
});
