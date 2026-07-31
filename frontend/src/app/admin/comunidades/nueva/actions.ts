"use server";

import { redirect } from "next/navigation";
import { apiPost, ApiError } from "@/lib/api-client";
import type { Comunidad } from "@/types/api";

export async function createComunidadAction(formData: FormData) {
  const nombre = formData.get("nombre");
  const direccion = formData.get("direccion");
  const cif = formData.get("cif");

  let comunidad: Comunidad;
  try {
    comunidad = await apiPost<Comunidad>("/api/comunidades", {
      nombre,
      direccion,
      cif: cif || undefined,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      redirect(`/admin/comunidades/nueva?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  redirect(`/admin/comunidades/${comunidad.id}`);
}
