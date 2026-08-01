"use server";

import { redirect } from "next/navigation";
import { apiAcceptInvite, ApiError } from "@/lib/api-client";
import { setSessionCookie } from "@/lib/session";

export async function acceptInviteAction(_prevState: string | undefined, formData: FormData) {
  const token = formData.get("token");
  const nombre = formData.get("nombre");
  const telefono = formData.get("telefono");
  const password = formData.get("password");
  const passwordConfirm = formData.get("passwordConfirm");

  if (typeof token !== "string" || typeof nombre !== "string" || typeof password !== "string") {
    return "Faltan datos.";
  }

  if (password !== passwordConfirm) {
    return "Las contraseñas no coinciden.";
  }

  let sessionToken: string;
  try {
    const result = await apiAcceptInvite({
      token,
      nombre,
      telefono: typeof telefono === "string" && telefono ? telefono : undefined,
      password,
    });
    sessionToken = result.token;
  } catch (error) {
    if (error instanceof ApiError) {
      return error.message;
    }
    throw error;
  }

  await setSessionCookie(sessionToken);
  redirect("/");
}
