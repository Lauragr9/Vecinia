import { Router } from "express";
import * as z from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireAdmin, requireMembership } from "../middleware/auth.js";
import { HttpError } from "../middleware/error-handler.js";

export const gastosRouter = Router();
gastosRouter.use(requireAuth);

gastosRouter.get("/comunidades/:id/movimientos", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId, ["ADMIN", "PRESIDENTE"]);

  const movimientos = await prisma.movimientoContable.findMany({
    where: { comunidadId },
    orderBy: { fecha: "desc" },
  });

  res.json(movimientos);
});

const movimientoSchema = z.object({
  tipo: z.enum(["INGRESO", "GASTO"]),
  concepto: z.string().trim().min(1, "El concepto es obligatorio."),
  importe: z.coerce.number().positive("El importe debe ser mayor que 0."),
  fecha: z.string().min(1, "La fecha es obligatoria."),
});

gastosRouter.post("/comunidades/:id/movimientos", async (req, res) => {
  const comunidadId = req.params.id;
  await requireAdmin(req.user!.id, comunidadId);

  const parsed = movimientoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const movimiento = await prisma.movimientoContable.create({
    data: {
      comunidadId,
      tipo: parsed.data.tipo,
      concepto: parsed.data.concepto,
      importe: parsed.data.importe,
      fecha: new Date(parsed.data.fecha),
    },
  });

  res.status(201).json(movimiento);
});

gastosRouter.get("/comunidades/:id/recibos", async (req, res) => {
  const comunidadId = req.params.id;
  await requireAdmin(req.user!.id, comunidadId);

  const recibos = await prisma.recibo.findMany({
    where: { unidad: { edificio: { comunidadId } } },
    include: { unidad: true },
    orderBy: { fechaVencimiento: "desc" },
  });

  res.json(recibos);
});

const reciboSchema = z.object({
  unidadId: z.string().min(1, "Selecciona una unidad."),
  concepto: z.string().trim().min(1, "El concepto es obligatorio."),
  importe: z.coerce.number().positive("El importe debe ser mayor que 0."),
  fechaEmision: z.string().min(1, "La fecha de emisión es obligatoria."),
  fechaVencimiento: z.string().min(1, "La fecha de vencimiento es obligatoria."),
});

gastosRouter.post("/comunidades/:id/recibos", async (req, res) => {
  const comunidadId = req.params.id;
  await requireAdmin(req.user!.id, comunidadId);

  const parsed = reciboSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const recibo = await prisma.recibo.create({
    data: {
      unidadId: parsed.data.unidadId,
      concepto: parsed.data.concepto,
      importe: parsed.data.importe,
      fechaEmision: new Date(parsed.data.fechaEmision),
      fechaVencimiento: new Date(parsed.data.fechaVencimiento),
    },
  });

  res.status(201).json(recibo);
});

gastosRouter.post("/recibos/:id/toggle", async (req, res) => {
  const recibo = await prisma.recibo.findUnique({
    where: { id: req.params.id },
    include: { unidad: { include: { edificio: true } } },
  });
  if (!recibo) throw new HttpError(404, "Recibo no encontrado.");
  await requireAdmin(req.user!.id, recibo.unidad.edificio.comunidadId);

  const updated = await prisma.recibo.update({
    where: { id: recibo.id },
    data: { estado: recibo.estado === "PENDIENTE" ? "PAGADO" : "PENDIENTE" },
  });

  res.json(updated);
});

gastosRouter.get("/comunidades/:id/mis-recibos", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId);

  const recibos = await prisma.recibo.findMany({
    where: {
      unidad: {
        edificio: { comunidadId },
        OR: [{ propietarioId: req.user!.id }, { inquilinoId: req.user!.id }],
      },
    },
    include: { unidad: true },
    orderBy: { fechaVencimiento: "desc" },
  });

  res.json(recibos);
});
