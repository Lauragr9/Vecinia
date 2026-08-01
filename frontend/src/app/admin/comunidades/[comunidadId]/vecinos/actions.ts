"use server";

import { redirect } from "next/navigation";
import { apiPost, apiDelete, ApiError } from "@/lib/api-client";

export async function createVecinoAction(comunidadId: string, formData: FormData) {
  const base = `/admin/comunidades/${comunidadId}/vecinos`;
  const email = formData.get("email");

  let invited = false;
  try {
    const result = await apiPost<{ invited: boolean }>(`/api/comunidades/${comunidadId}/vecinos`, {
      email,
      role: formData.get("role"),
    });
    invited = result.invited;
  } catch (error) {
    if (error instanceof ApiError) {
      redirect(`${base}/nuevo?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  redirect(`${base}?created=${encodeURIComponent(String(email))}&invited=${invited ? "1" : "0"}`);
}

export async function eliminarVecinoAction(comunidadId: string, membershipId: string) {
  await apiDelete(`/api/vecinos/${membershipId}`);
  redirect(`/admin/comunidades/${comunidadId}/vecinos`);
}
