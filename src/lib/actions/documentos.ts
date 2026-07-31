"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { requireMembership } from "@/lib/dal";
import { saveUploadedFile } from "@/lib/storage";

const schema = z.object({
  categoria: z.string().trim().min(1, "Selecciona una categoría."),
  nombre: z.string().trim().min(1, "El nombre es obligatorio."),
});

export async function uploadDocumentoAction(comunidadId: string, returnTo: string, formData: FormData) {
  const { session } = await requireMembership(comunidadId, ["ADMIN", "PRESIDENTE"]);

  const parsed = schema.safeParse({
    categoria: formData.get("categoria"),
    nombre: formData.get("nombre"),
  });

  const archivo = formData.get("archivo");

  if (!parsed.success || !(archivo instanceof File) || archivo.size === 0) {
    const message = parsed.success ? "Selecciona un archivo." : parsed.error.issues[0]?.message ?? "Datos inválidos.";
    redirect(`${returnTo}/nuevo?error=${encodeURIComponent(message)}`);
  }

  const url = await saveUploadedFile(archivo as File, `documentos/${comunidadId}`);

  await prisma.documento.create({
    data: {
      comunidadId,
      categoria: parsed.data!.categoria,
      nombre: parsed.data!.nombre,
      url,
      subidoPorId: session.user.id,
    },
  });

  redirect(returnTo);
}
