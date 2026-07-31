"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { requireMembership } from "@/lib/dal";

const movimientoSchema = z.object({
  tipo: z.enum(["INGRESO", "GASTO"]),
  concepto: z.string().trim().min(1, "El concepto es obligatorio."),
  importe: z.coerce.number().positive("El importe debe ser mayor que 0."),
  fecha: z.string().min(1, "La fecha es obligatoria."),
});

export async function createMovimientoAction(comunidadId: string, returnTo: string, formData: FormData) {
  await requireMembership(comunidadId, ["ADMIN"]);

  const parsed = movimientoSchema.safeParse({
    tipo: formData.get("tipo"),
    concepto: formData.get("concepto"),
    importe: formData.get("importe"),
    fecha: formData.get("fecha"),
  });

  if (!parsed.success) {
    redirect(`${returnTo}/nuevo?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Datos inválidos.")}`);
  }

  await prisma.movimientoContable.create({
    data: {
      comunidadId,
      tipo: parsed.data.tipo,
      concepto: parsed.data.concepto,
      importe: parsed.data.importe,
      fecha: new Date(parsed.data.fecha),
    },
  });

  redirect(returnTo);
}

const reciboSchema = z.object({
  unidadId: z.string().min(1, "Selecciona una unidad."),
  concepto: z.string().trim().min(1, "El concepto es obligatorio."),
  importe: z.coerce.number().positive("El importe debe ser mayor que 0."),
  fechaEmision: z.string().min(1, "La fecha de emisión es obligatoria."),
  fechaVencimiento: z.string().min(1, "La fecha de vencimiento es obligatoria."),
});

export async function createReciboAction(comunidadId: string, returnTo: string, formData: FormData) {
  await requireMembership(comunidadId, ["ADMIN"]);

  const parsed = reciboSchema.safeParse({
    unidadId: formData.get("unidadId"),
    concepto: formData.get("concepto"),
    importe: formData.get("importe"),
    fechaEmision: formData.get("fechaEmision"),
    fechaVencimiento: formData.get("fechaVencimiento"),
  });

  if (!parsed.success) {
    redirect(`${returnTo}/nuevo?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Datos inválidos.")}`);
  }

  await prisma.recibo.create({
    data: {
      unidadId: parsed.data.unidadId,
      concepto: parsed.data.concepto,
      importe: parsed.data.importe,
      fechaEmision: new Date(parsed.data.fechaEmision),
      fechaVencimiento: new Date(parsed.data.fechaVencimiento),
    },
  });

  redirect(returnTo);
}

export async function toggleReciboEstadoAction(comunidadId: string, reciboId: string, returnTo: string) {
  await requireMembership(comunidadId, ["ADMIN"]);

  const recibo = await prisma.recibo.findUnique({ where: { id: reciboId } });
  if (!recibo) return;

  await prisma.recibo.update({
    where: { id: reciboId },
    data: { estado: recibo.estado === "PENDIENTE" ? "PAGADO" : "PENDIENTE" },
  });

  revalidatePath(returnTo);
}
