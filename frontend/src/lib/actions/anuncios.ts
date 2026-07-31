"use server";

import { redirect } from "next/navigation";
import { apiPost, ApiError } from "@/lib/api-client";

export async function createAnuncioAction(comunidadId: string, returnTo: string, formData: FormData) {
  try {
    await apiPost(`/api/comunidades/${comunidadId}/anuncios`, {
      titulo: formData.get("titulo"),
      cuerpo: formData.get("cuerpo"),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      redirect(`${returnTo}/nuevo?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  redirect(returnTo);
}
