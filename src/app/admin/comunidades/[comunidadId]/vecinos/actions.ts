"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";

const DEFAULT_PASSWORD = "bienvenido123";

const schema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio."),
  email: z.email("Email no válido."),
  telefono: z.string().trim().optional(),
  role: z.enum(["VECINO", "PRESIDENTE"]),
});

export async function createVecinoAction(comunidadId: string, formData: FormData) {
  await requireAdmin(comunidadId);

  const parsed = schema.safeParse({
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    telefono: formData.get("telefono") || undefined,
    role: formData.get("role"),
  });

  const base = `/admin/comunidades/${comunidadId}/vecinos`;

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Datos inválidos.";
    redirect(`${base}/nuevo?error=${encodeURIComponent(message)}`);
  }

  const { nombre, email, telefono, role } = parsed.data;

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    user = await prisma.user.create({
      data: { nombre, email, telefono, passwordHash },
    });
  }

  const existingMembership = await prisma.membership.findUnique({
    where: { userId_comunidadId: { userId: user.id, comunidadId } },
  });

  if (existingMembership) {
    redirect(`${base}/nuevo?error=${encodeURIComponent("Ese email ya pertenece a esta comunidad.")}`);
  }

  await prisma.membership.create({
    data: { userId: user.id, comunidadId, role },
  });

  redirect(`${base}?created=${encodeURIComponent(email)}`);
}

export async function eliminarVecinoAction(comunidadId: string, membershipId: string) {
  await requireAdmin(comunidadId);
  await prisma.membership.delete({ where: { id: membershipId } });
  redirect(`/admin/comunidades/${comunidadId}/vecinos`);
}
