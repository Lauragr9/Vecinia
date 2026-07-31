"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { requireMembership } from "@/lib/dal";

const votacionSchema = z.object({
  pregunta: z.string().trim().min(2, "La pregunta es obligatoria."),
  fechaCierre: z.string().min(1, "La fecha de cierre es obligatoria."),
  resultadosVisibles: z.string().optional(),
});

export async function createVotacionAction(comunidadId: string, returnTo: string, formData: FormData) {
  await requireMembership(comunidadId, ["ADMIN", "PRESIDENTE"]);

  const parsed = votacionSchema.safeParse({
    pregunta: formData.get("pregunta"),
    fechaCierre: formData.get("fechaCierre"),
    resultadosVisibles: formData.get("resultadosVisibles") ?? undefined,
  });

  if (!parsed.success) {
    redirect(`${returnTo}/nueva?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Datos inválidos.")}`);
  }

  await prisma.votacion.create({
    data: {
      comunidadId,
      pregunta: parsed.data.pregunta,
      fechaCierre: new Date(parsed.data.fechaCierre),
      resultadosVisibles: parsed.data.resultadosVisibles === "on",
    },
  });

  redirect(returnTo);
}

const votoSchema = z.object({
  opcion: z.enum(["SI", "NO", "ABSTENCION"]),
});

export async function votarAction(
  comunidadId: string,
  votacionId: string,
  unidadId: string,
  returnTo: string,
  formData: FormData
) {
  const { session } = await requireMembership(comunidadId);

  const unidad = await prisma.unidad.findUnique({ where: { id: unidadId } });
  if (!unidad || (unidad.propietarioId !== session.user.id && unidad.inquilinoId !== session.user.id)) {
    return;
  }

  const parsed = votoSchema.safeParse({ opcion: formData.get("opcion") });
  if (!parsed.success) return;

  await prisma.voto.upsert({
    where: { votacionId_unidadId: { votacionId, unidadId } },
    update: { opcion: parsed.data.opcion },
    create: { votacionId, unidadId, opcion: parsed.data.opcion },
  });

  revalidatePath(returnTo);
}
