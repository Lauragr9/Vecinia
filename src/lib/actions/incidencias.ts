"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { requireMembership } from "@/lib/dal";
import { saveUploadedFile } from "@/lib/storage";

const createSchema = z.object({
  titulo: z.string().trim().min(2, "El título es obligatorio."),
  descripcion: z.string().trim().min(2, "La descripción es obligatoria."),
});

export async function createIncidenciaAction(
  comunidadId: string,
  unidadId: string | null,
  returnTo: string,
  formData: FormData
) {
  const { session } = await requireMembership(comunidadId);

  const parsed = createSchema.safeParse({
    titulo: formData.get("titulo"),
    descripcion: formData.get("descripcion"),
  });

  if (!parsed.success) {
    redirect(`${returnTo}/nueva?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Datos inválidos.")}`);
  }

  const fotos: string[] = [];
  const fotoFiles = formData.getAll("fotos").filter((f): f is File => f instanceof File && f.size > 0);
  for (const foto of fotoFiles) {
    fotos.push(await saveUploadedFile(foto, `incidencias/${comunidadId}`));
  }

  const incidencia = await prisma.incidencia.create({
    data: {
      comunidadId,
      unidadId: unidadId ?? undefined,
      titulo: parsed.data.titulo,
      descripcion: parsed.data.descripcion,
      creadoPorId: session.user.id,
      fotos,
    },
  });

  redirect(`${returnTo}/${incidencia.id}`);
}

const estadoSchema = z.object({
  estado: z.enum(["PENDIENTE", "EN_PROCESO", "RESUELTO"]),
});

export async function cambiarEstadoIncidenciaAction(
  comunidadId: string,
  incidenciaId: string,
  returnTo: string,
  formData: FormData
) {
  await requireMembership(comunidadId, ["ADMIN", "PRESIDENTE"]);

  const parsed = estadoSchema.safeParse({ estado: formData.get("estado") });
  if (parsed.success) {
    await prisma.incidencia.update({
      where: { id: incidenciaId },
      data: { estado: parsed.data.estado },
    });
  }

  revalidatePath(returnTo);
}

const comentarioSchema = z.object({
  texto: z.string().trim().min(1, "Escribe un comentario."),
});

export async function comentarIncidenciaAction(
  comunidadId: string,
  incidenciaId: string,
  returnTo: string,
  formData: FormData
) {
  const { session } = await requireMembership(comunidadId);

  const parsed = comentarioSchema.safeParse({ texto: formData.get("texto") });
  if (parsed.success) {
    await prisma.incidenciaComentario.create({
      data: {
        incidenciaId,
        autorId: session.user.id,
        texto: parsed.data.texto,
      },
    });
  }

  revalidatePath(returnTo);
}
