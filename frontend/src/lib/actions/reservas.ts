"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiPost, ApiError } from "@/lib/api-client";

export async function createZonaAction(comunidadId: string, returnTo: string, formData: FormData) {
  try {
    await apiPost(`/api/comunidades/${comunidadId}/zonas`, {
      nombre: formData.get("nombre"),
      descripcion: formData.get("descripcion") || undefined,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      redirect(`${returnTo}/zonas/nueva?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  redirect(returnTo);
}

export async function createReservaAction(comunidadId: string, returnTo: string, formData: FormData) {
  try {
    await apiPost(`/api/comunidades/${comunidadId}/reservas`, {
      zonaComunId: formData.get("zonaComunId"),
      unidadId: formData.get("unidadId"),
      fecha: formData.get("fecha"),
      horaInicio: formData.get("horaInicio"),
      horaFin: formData.get("horaFin"),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      redirect(`${returnTo}/nueva?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  redirect(returnTo);
}

export async function cancelarReservaAction(comunidadId: string, reservaId: string, returnTo: string) {
  void comunidadId;
  await apiPost(`/api/reservas/${reservaId}/cancelar`);
  revalidatePath(returnTo);
}
