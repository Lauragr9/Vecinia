"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { requireMembership } from "@/lib/dal";

const zonaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio."),
  descripcion: z.string().trim().optional(),
});

export async function createZonaAction(comunidadId: string, returnTo: string, formData: FormData) {
  await requireMembership(comunidadId, ["ADMIN"]);

  const parsed = zonaSchema.safeParse({
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion") || undefined,
  });

  if (!parsed.success) {
    redirect(`${returnTo}/zonas/nueva?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Datos inválidos.")}`);
  }

  await prisma.zonaComun.create({ data: { comunidadId, ...parsed.data } });
  redirect(returnTo);
}

const reservaSchema = z.object({
  zonaComunId: z.string().min(1, "Selecciona una zona."),
  unidadId: z.string().min(1, "Selecciona una unidad."),
  fecha: z.string().min(1, "La fecha es obligatoria."),
  horaInicio: z.string().min(1, "La hora de inicio es obligatoria."),
  horaFin: z.string().min(1, "La hora de fin es obligatoria."),
});

export async function createReservaAction(comunidadId: string, returnTo: string, formData: FormData) {
  await requireMembership(comunidadId);

  const parsed = reservaSchema.safeParse({
    zonaComunId: formData.get("zonaComunId"),
    unidadId: formData.get("unidadId"),
    fecha: formData.get("fecha"),
    horaInicio: formData.get("horaInicio"),
    horaFin: formData.get("horaFin"),
  });

  if (!parsed.success) {
    redirect(`${returnTo}/nueva?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Datos inválidos.")}`);
  }

  const { zonaComunId, unidadId, fecha, horaInicio, horaFin } = parsed.data;

  await prisma.reserva.create({
    data: { zonaComunId, unidadId, fecha: new Date(fecha), horaInicio, horaFin },
  });

  redirect(returnTo);
}

export async function cancelarReservaAction(comunidadId: string, reservaId: string, returnTo: string) {
  const { session, membership } = await requireMembership(comunidadId);

  const reserva = await prisma.reserva.findUnique({
    where: { id: reservaId },
    include: { unidad: true },
  });

  if (!reserva) return;

  const isManager = membership.role === "ADMIN" || membership.role === "PRESIDENTE";
  const isOwner =
    reserva.unidad.propietarioId === session.user.id || reserva.unidad.inquilinoId === session.user.id;

  if (!isManager && !isOwner) return;

  await prisma.reserva.update({ where: { id: reservaId }, data: { estado: "CANCELADA" } });
  revalidatePath(returnTo);
}
