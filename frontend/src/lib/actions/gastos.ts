"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiPost, ApiError } from "@/lib/api-client";

export async function createMovimientoAction(comunidadId: string, returnTo: string, formData: FormData) {
  try {
    await apiPost(`/api/comunidades/${comunidadId}/movimientos`, {
      tipo: formData.get("tipo"),
      concepto: formData.get("concepto"),
      importe: formData.get("importe"),
      fecha: formData.get("fecha"),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      redirect(`${returnTo}/nuevo?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  redirect(returnTo);
}

export async function createReciboAction(comunidadId: string, returnTo: string, formData: FormData) {
  try {
    await apiPost(`/api/comunidades/${comunidadId}/recibos`, {
      unidadId: formData.get("unidadId"),
      concepto: formData.get("concepto"),
      importe: formData.get("importe"),
      fechaEmision: formData.get("fechaEmision"),
      fechaVencimiento: formData.get("fechaVencimiento"),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      redirect(`${returnTo}/nuevo?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  redirect(returnTo);
}

export async function toggleReciboEstadoAction(comunidadId: string, reciboId: string, returnTo: string) {
  void comunidadId;
  await apiPost(`/api/recibos/${reciboId}/toggle`);
  revalidatePath(returnTo);
}
