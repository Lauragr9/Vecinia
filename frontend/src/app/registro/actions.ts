"use server";

import { redirect } from "next/navigation";
import { apiRegister, apiResendVerification, ApiError } from "@/lib/api-client";

export async function registerAction(_prevState: string | undefined, formData: FormData) {
  const nombre = formData.get("nombre");
  const email = formData.get("email");
  const password = formData.get("password");
  const passwordConfirm = formData.get("passwordConfirm");

  if (typeof nombre !== "string" || typeof email !== "string" || typeof password !== "string") {
    return "Rellena todos los campos.";
  }

  if (password !== passwordConfirm) {
    return "Las contraseñas no coinciden.";
  }

  try {
    await apiRegister({ nombre, email, password });
  } catch (error) {
    if (error instanceof ApiError) {
      return error.message;
    }
    throw error;
  }

  redirect(`/registro/confirmacion?email=${encodeURIComponent(email)}`);
}

export async function resendVerificationAction(email: string) {
  await apiResendVerification(email);
  redirect(`/registro/confirmacion?email=${encodeURIComponent(email)}&reenviado=1`);
}
