"use server";

import { redirect } from "next/navigation";
import { apiPost, apiDelete, ApiError } from "@/lib/api-client";

export async function createEdificioAction(comunidadId: string, formData: FormData) {
  const base = `/admin/comunidades/${comunidadId}/edificios`;

  try {
    await apiPost(`/api/comunidades/${comunidadId}/edificios`, {
      nombre: formData.get("nombre"),
      direccion: formData.get("direccion"),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      redirect(`${base}/nuevo?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  redirect(base);
}

export async function createUnidadAction(comunidadId: string, edificioId: string, formData: FormData) {
  const base = `/admin/comunidades/${comunidadId}/edificios`;

  try {
    await apiPost(`/api/edificios/${edificioId}/unidades`, {
      tipo: formData.get("tipo"),
      identificador: formData.get("identificador"),
      propietarioId: formData.get("propietarioId") || undefined,
      inquilinoId: formData.get("inquilinoId") || undefined,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      redirect(`${base}/${edificioId}/unidades/nueva?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  redirect(base);
}

export async function eliminarUnidadAction(comunidadId: string, unidadId: string) {
  await apiDelete(`/api/unidades/${unidadId}`);
  redirect(`/admin/comunidades/${comunidadId}/edificios`);
}
