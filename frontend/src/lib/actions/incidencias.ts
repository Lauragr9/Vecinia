"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiUpload, apiPatch, apiPost, ApiError } from "@/lib/api-client";
import type { Incidencia } from "@/types/api";

export async function createIncidenciaAction(
  comunidadId: string,
  unidadId: string | null,
  returnTo: string,
  formData: FormData
) {
  if (unidadId) {
    formData.set("unidadId", unidadId);
  }

  let incidencia: Incidencia;
  try {
    incidencia = await apiUpload<Incidencia>(`/api/comunidades/${comunidadId}/incidencias`, formData);
  } catch (error) {
    if (error instanceof ApiError) {
      redirect(`${returnTo}/nueva?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  redirect(`${returnTo}/${incidencia.id}`);
}

export async function cambiarEstadoIncidenciaAction(
  comunidadId: string,
  incidenciaId: string,
  returnTo: string,
  formData: FormData
) {
  void comunidadId;
  await apiPatch(`/api/incidencias/${incidenciaId}/estado`, { estado: formData.get("estado") });
  revalidatePath(returnTo);
}

export async function comentarIncidenciaAction(
  comunidadId: string,
  incidenciaId: string,
  returnTo: string,
  formData: FormData
) {
  void comunidadId;
  await apiPost(`/api/incidencias/${incidenciaId}/comentarios`, { texto: formData.get("texto") });
  revalidatePath(returnTo);
}
