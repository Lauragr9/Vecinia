import { Router } from "express";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireAdmin, requireMembership } from "../middleware/auth.js";
import { HttpError } from "../middleware/error-handler.js";

export const comunidadesRouter = Router();
comunidadesRouter.use(requireAuth);

const DEFAULT_PASSWORD = "bienvenido123";

const comunidadSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio."),
  direccion: z.string().trim().min(2, "La dirección es obligatoria."),
  cif: z.string().trim().optional(),
});

comunidadesRouter.post("/comunidades", async (req, res) => {
  const parsed = comunidadSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const comunidad = await prisma.comunidad.create({
    data: {
      ...parsed.data,
      memberships: { create: { userId: req.user!.id, role: "ADMIN" } },
    },
  });

  res.status(201).json(comunidad);
});

comunidadesRouter.get("/comunidades/:id", async (req, res) => {
  await requireMembership(req.user!.id, req.params.id);
  const comunidad = await prisma.comunidad.findUnique({ where: { id: req.params.id } });
  if (!comunidad) throw new HttpError(404, "Comunidad no encontrada.");
  res.json(comunidad);
});

comunidadesRouter.get("/comunidades/:id/stats", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId);

  const [edificios, unidades, incidenciasAbiertas, recibosPendientes, vecinos] = await Promise.all([
    prisma.edificio.count({ where: { comunidadId } }),
    prisma.unidad.count({ where: { edificio: { comunidadId } } }),
    prisma.incidencia.count({ where: { comunidadId, estado: { not: "RESUELTO" } } }),
    prisma.recibo.count({ where: { unidad: { edificio: { comunidadId } }, estado: "PENDIENTE" } }),
    prisma.membership.count({ where: { comunidadId, role: { in: ["VECINO", "PRESIDENTE"] } } }),
  ]);

  res.json({ edificios, unidades, incidenciasAbiertas, recibosPendientes, vecinos });
});

// --- Edificios ---

comunidadesRouter.get("/comunidades/:id/edificios", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId);

  const edificios = await prisma.edificio.findMany({
    where: { comunidadId },
    include: {
      unidades: { include: { propietario: true, inquilino: true }, orderBy: { identificador: "asc" } },
    },
    orderBy: { nombre: "asc" },
  });

  res.json(edificios);
});

const edificioSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio."),
  direccion: z.string().trim().min(1, "La dirección es obligatoria."),
});

comunidadesRouter.post("/comunidades/:id/edificios", async (req, res) => {
  const comunidadId = req.params.id;
  await requireAdmin(req.user!.id, comunidadId);

  const parsed = edificioSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const edificio = await prisma.edificio.create({ data: { comunidadId, ...parsed.data } });
  res.status(201).json(edificio);
});

// --- Unidades ---

const unidadSchema = z.object({
  tipo: z.enum(["VIVIENDA", "GARAJE", "TRASTERO"]),
  identificador: z.string().trim().min(1, "El identificador es obligatorio."),
  propietarioId: z.string().trim().optional().nullable(),
  inquilinoId: z.string().trim().optional().nullable(),
});

comunidadesRouter.post("/edificios/:edificioId/unidades", async (req, res) => {
  const edificio = await prisma.edificio.findUnique({ where: { id: req.params.edificioId } });
  if (!edificio) throw new HttpError(404, "Edificio no encontrado.");
  await requireAdmin(req.user!.id, edificio.comunidadId);

  const parsed = unidadSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const { tipo, identificador, propietarioId, inquilinoId } = parsed.data;

  try {
    const unidad = await prisma.unidad.create({
      data: {
        edificioId: edificio.id,
        tipo,
        identificador,
        propietarioId: propietarioId || undefined,
        inquilinoId: inquilinoId || undefined,
      },
    });
    res.status(201).json(unidad);
  } catch {
    throw new HttpError(409, "Ya existe una unidad con ese identificador en este edificio.");
  }
});

comunidadesRouter.delete("/unidades/:id", async (req, res) => {
  const unidad = await prisma.unidad.findUnique({
    where: { id: req.params.id },
    include: { edificio: true },
  });
  if (!unidad) throw new HttpError(404, "Unidad no encontrada.");
  await requireAdmin(req.user!.id, unidad.edificio.comunidadId);

  await prisma.unidad.delete({ where: { id: unidad.id } });
  res.status(204).send();
});

comunidadesRouter.get("/comunidades/:id/mis-unidades", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId);

  const unidades = await prisma.unidad.findMany({
    where: {
      edificio: { comunidadId },
      OR: [{ propietarioId: req.user!.id }, { inquilinoId: req.user!.id }],
    },
    orderBy: { identificador: "asc" },
  });

  res.json(unidades);
});

// --- Vecinos (memberships) ---

comunidadesRouter.get("/comunidades/:id/vecinos", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId);

  const memberships = await prisma.membership.findMany({
    where: { comunidadId },
    include: { user: true },
    orderBy: { user: { nombre: "asc" } },
  });

  res.json(memberships);
});

const vecinoSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio."),
  email: z.email("Email no válido."),
  telefono: z.string().trim().optional(),
  role: z.enum(["VECINO", "PRESIDENTE"]),
});

comunidadesRouter.post("/comunidades/:id/vecinos", async (req, res) => {
  const comunidadId = req.params.id;
  await requireAdmin(req.user!.id, comunidadId);

  const parsed = vecinoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const { nombre, email, telefono, role } = parsed.data;

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    user = await prisma.user.create({ data: { nombre, email, telefono, passwordHash } });
  }

  const existing = await prisma.membership.findUnique({
    where: { userId_comunidadId: { userId: user.id, comunidadId } },
  });
  if (existing) {
    throw new HttpError(409, "Ese email ya pertenece a esta comunidad.");
  }

  const membership = await prisma.membership.create({
    data: { userId: user.id, comunidadId, role },
    include: { user: true },
  });

  res.status(201).json({ membership, defaultPassword: DEFAULT_PASSWORD });
});

comunidadesRouter.delete("/vecinos/:membershipId", async (req, res) => {
  const membership = await prisma.membership.findUnique({ where: { id: req.params.membershipId } });
  if (!membership) throw new HttpError(404, "No encontrado.");
  await requireAdmin(req.user!.id, membership.comunidadId);

  await prisma.membership.delete({ where: { id: membership.id } });
  res.status(204).send();
});
