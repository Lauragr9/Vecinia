"use server";

import { redirect } from "next/navigation";
import { apiUpload, ApiError } from "@/lib/api-client";

export async function uploadDocumentoAction(comunidadId: string, returnTo: string, formData: FormData) {
  try {
    await apiUpload(`/api/comunidades/${comunidadId}/documentos`, formData);
  } catch (error) {
    if (error instanceof ApiError) {
      redirect(`${returnTo}/nuevo?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  redirect(returnTo);
}
