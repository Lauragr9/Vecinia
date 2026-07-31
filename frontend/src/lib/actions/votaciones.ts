"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiPost, ApiError } from "@/lib/api-client";

export async function createVotacionAction(comunidadId: string, returnTo: string, formData: FormData) {
  try {
    await apiPost(`/api/comunidades/${comunidadId}/votaciones`, {
      pregunta: formData.get("pregunta"),
      fechaCierre: formData.get("fechaCierre"),
      resultadosVisibles: formData.get("resultadosVisibles") === "on",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      redirect(`${returnTo}/nueva?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  redirect(returnTo);
}

export async function votarAction(
  comunidadId: string,
  votacionId: string,
  unidadId: string,
  returnTo: string,
  formData: FormData
) {
  void comunidadId;
  await apiPost(`/api/votaciones/${votacionId}/votar`, {
    unidadId,
    opcion: formData.get("opcion"),
  });
  revalidatePath(returnTo);
}
