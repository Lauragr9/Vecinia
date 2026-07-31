import { Router } from "express";
import * as z from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireAdmin, requireMembership } from "../middleware/auth.js";
import { HttpError } from "../middleware/error-handler.js";

export const reservasRouter = Router();
reservasRouter.use(requireAuth);

reservasRouter.get("/comunidades/:id/zonas", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId);

  const zonas = await prisma.zonaComun.findMany({ where: { comunidadId }, orderBy: { nombre: "asc" } });
  res.json(zonas);
});

const zonaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio."),
  descripcion: z.string().trim().optional(),
});

reservasRouter.post("/comunidades/:id/zonas", async (req, res) => {
  const comunidadId = req.params.id;
  await requireAdmin(req.user!.id, comunidadId);

  const parsed = zonaSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const zona = await prisma.zonaComun.create({ data: { comunidadId, ...parsed.data } });
  res.status(201).json(zona);
});

// Zonas con sus reservas próximas (confirmadas), para el tablero de reservas.
reservasRouter.get("/comunidades/:id/reservas", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId);

  const zonas = await prisma.zonaComun.findMany({
    where: { comunidadId },
    include: {
      reservas: {
        where: { estado: "CONFIRMADA", fecha: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
        include: { unidad: true },
        orderBy: [{ fecha: "asc" }, { horaInicio: "asc" }],
      },
    },
    orderBy: { nombre: "asc" },
  });

  res.json(zonas);
});

const reservaSchema = z.object({
  zonaComunId: z.string().min(1, "Selecciona una zona."),
  unidadId: z.string().min(1, "Selecciona una unidad."),
  fecha: z.string().min(1, "La fecha es obligatoria."),
  horaInicio: z.string().min(1, "La hora de inicio es obligatoria."),
  horaFin: z.string().min(1, "La hora de fin es obligatoria."),
});

reservasRouter.post("/comunidades/:id/reservas", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId);

  const parsed = reservaSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const { zonaComunId, unidadId, fecha, horaInicio, horaFin } = parsed.data;

  const reserva = await prisma.reserva.create({
    data: { zonaComunId, unidadId, fecha: new Date(fecha), horaInicio, horaFin },
  });

  res.status(201).json(reserva);
});

reservasRouter.post("/reservas/:id/cancelar", async (req, res) => {
  const reserva = await prisma.reserva.findUnique({
    where: { id: req.params.id },
    include: { unidad: { include: { edificio: true } } },
  });
  if (!reserva) throw new HttpError(404, "Reserva no encontrada.");

  const comunidadId = reserva.unidad.edificio.comunidadId;
  const membership = await requireMembership(req.user!.id, comunidadId);

  const isManager = membership.role === "ADMIN" || membership.role === "PRESIDENTE";
  const isOwner =
    reserva.unidad.propietarioId === req.user!.id || reserva.unidad.inquilinoId === req.user!.id;

  if (!isManager && !isOwner) {
    throw new HttpError(403, "No puedes cancelar esta reserva.");
  }

  const updated = await prisma.reserva.update({ where: { id: reserva.id }, data: { estado: "CANCELADA" } });
  res.json(updated);
});
