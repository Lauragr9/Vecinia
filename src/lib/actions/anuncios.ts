"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { requireMembership } from "@/lib/dal";

const schema = z.object({
  titulo: z.string().trim().min(2, "El título es obligatorio."),
  cuerpo: z.string().trim().min(2, "El contenido es obligatorio."),
});

export async function createAnuncioAction(comunidadId: string, returnTo: string, formData: FormData) {
  const { session } = await requireMembership(comunidadId, ["ADMIN", "PRESIDENTE"]);

  const parsed = schema.safeParse({
    titulo: formData.get("titulo"),
    cuerpo: formData.get("cuerpo"),
  });

  if (!parsed.success) {
    redirect(`${returnTo}/nuevo?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Datos inválidos.")}`);
  }

  await prisma.anuncio.create({
    data: { comunidadId, ...parsed.data, autorId: session.user.id },
  });

  redirect(returnTo);
}
