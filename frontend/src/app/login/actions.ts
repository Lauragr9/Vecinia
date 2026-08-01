"use server";

import { redirect } from "next/navigation";
import { apiLogin, ApiError } from "@/lib/api-client";
import { setSessionCookie } from "@/lib/session";

export async function loginAction(_prevState: string | undefined, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return "Introduce tu email y contraseña.";
  }

  let token: string;
  try {
    const result = await apiLogin(email, password);
    token = result.token;
  } catch (error) {
    if (error instanceof ApiError) {
      return error.message;
    }
    throw error;
  }

  await setSessionCookie(token);
  redirect("/");
}
