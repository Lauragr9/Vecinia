"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiLogin, ApiError } from "@/lib/api-client";
import { TOKEN_COOKIE } from "@/lib/constants";

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

  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/");
}
