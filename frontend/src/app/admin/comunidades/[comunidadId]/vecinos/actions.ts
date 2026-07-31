"use server";

import { redirect } from "next/navigation";
import { apiPost, apiDelete, ApiError } from "@/lib/api-client";

export async function createVecinoAction(comunidadId: string, formData: FormData) {
  const base = `/admin/comunidades/${comunidadId}/vecinos`;
  const email = formData.get("email");

  try {
    await apiPost(`/api/comunidades/${comunidadId}/vecinos`, {
      nombre: formData.get("nombre"),
      email,
      telefono: formData.get("telefono") || undefined,
      role: formData.get("role"),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      redirect(`${base}/nuevo?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  redirect(`${base}?created=${encodeURIComponent(String(email))}`);
}

export async function eliminarVecinoAction(comunidadId: string, membershipId: string) {
  await apiDelete(`/api/vecinos/${membershipId}`);
  redirect(`/admin/comunidades/${comunidadId}/vecinos`);
}
