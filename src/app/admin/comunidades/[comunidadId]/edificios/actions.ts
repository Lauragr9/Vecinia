"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";

const edificioSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio."),
  direccion: z.string().trim().min(1, "La dirección es obligatoria."),
});

export async function createEdificioAction(comunidadId: string, formData: FormData) {
  await requireAdmin(comunidadId);
  const base = `/admin/comunidades/${comunidadId}/edificios`;

  const parsed = edificioSchema.safeParse({
    nombre: formData.get("nombre"),
    direccion: formData.get("direccion"),
  });

  if (!parsed.success) {
    redirect(`${base}/nuevo?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Datos inválidos.")}`);
  }

  await prisma.edificio.create({ data: { comunidadId, ...parsed.data } });
  redirect(base);
}

const unidadSchema = z.object({
  tipo: z.enum(["VIVIENDA", "GARAJE", "TRASTERO"]),
  identificador: z.string().trim().min(1, "El identificador es obligatorio."),
  propietarioId: z.string().trim().optional(),
  inquilinoId: z.string().trim().optional(),
});

export async function createUnidadAction(comunidadId: string, edificioId: string, formData: FormData) {
  await requireAdmin(comunidadId);
  const base = `/admin/comunidades/${comunidadId}/edificios`;

  const parsed = unidadSchema.safeParse({
    tipo: formData.get("tipo"),
    identificador: formData.get("identificador"),
    propietarioId: formData.get("propietarioId") || undefined,
    inquilinoId: formData.get("inquilinoId") || undefined,
  });

  if (!parsed.success) {
    redirect(
      `${base}/${edificioId}/unidades/nueva?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Datos inválidos."
      )}`
    );
  }

  const { tipo, identificador, propietarioId, inquilinoId } = parsed.data;

  try {
    await prisma.unidad.create({
      data: { edificioId, tipo, identificador, propietarioId, inquilinoId },
    });
  } catch {
    redirect(
      `${base}/${edificioId}/unidades/nueva?error=${encodeURIComponent(
        "Ya existe una unidad con ese identificador en este edificio."
      )}`
    );
  }

  redirect(base);
}

export async function eliminarUnidadAction(comunidadId: string, unidadId: string) {
  await requireAdmin(comunidadId);
  await prisma.unidad.delete({ where: { id: unidadId } });
  redirect(`/admin/comunidades/${comunidadId}/edificios`);
}
