"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/dal";

const schema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio."),
  direccion: z.string().trim().min(2, "La dirección es obligatoria."),
  cif: z.string().trim().optional(),
});

export async function createComunidadAction(formData: FormData) {
  const session = await getSession();

  const parsed = schema.safeParse({
    nombre: formData.get("nombre"),
    direccion: formData.get("direccion"),
    cif: formData.get("cif") || undefined,
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Datos inválidos.";
    redirect(`/admin/comunidades/nueva?error=${encodeURIComponent(message)}`);
  }

  const comunidad = await prisma.comunidad.create({
    data: {
      ...parsed.data,
      memberships: {
        create: { userId: session.user.id, role: "ADMIN" },
      },
    },
  });

  redirect(`/admin/comunidades/${comunidad.id}`);
}
