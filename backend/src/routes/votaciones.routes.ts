import { Router } from "express";
import * as z from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireMembership } from "../middleware/auth.js";
import { HttpError } from "../middleware/error-handler.js";

export const votacionesRouter = Router();
votacionesRouter.use(requireAuth);

votacionesRouter.get("/comunidades/:id/votaciones", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId);

  const votaciones = await prisma.votacion.findMany({
    where: { comunidadId },
    include: { votos: true },
    orderBy: { fechaCierre: "desc" },
  });

  res.json(votaciones);
});

const votacionSchema = z.object({
  pregunta: z.string().trim().min(2, "La pregunta es obligatoria."),
  fechaCierre: z.string().min(1, "La fecha de cierre es obligatoria."),
  resultadosVisibles: z.boolean().optional(),
});

votacionesRouter.post("/comunidades/:id/votaciones", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId, ["ADMIN", "PRESIDENTE"]);

  const parsed = votacionSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const votacion = await prisma.votacion.create({
    data: {
      comunidadId,
      pregunta: parsed.data.pregunta,
      fechaCierre: new Date(parsed.data.fechaCierre),
      resultadosVisibles: parsed.data.resultadosVisibles ?? true,
    },
  });

  res.status(201).json(votacion);
});

const votoSchema = z.object({
  unidadId: z.string().min(1),
  opcion: z.enum(["SI", "NO", "ABSTENCION"]),
});

votacionesRouter.post("/votaciones/:id/votar", async (req, res) => {
  const votacion = await prisma.votacion.findUnique({ where: { id: req.params.id } });
  if (!votacion) throw new HttpError(404, "Votación no encontrada.");
  await requireMembership(req.user!.id, votacion.comunidadId);

  const parsed = votoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const unidad = await prisma.unidad.findUnique({ where: { id: parsed.data.unidadId } });
  if (!unidad || (unidad.propietarioId !== req.user!.id && unidad.inquilinoId !== req.user!.id)) {
    throw new HttpError(403, "Esa unidad no te pertenece.");
  }

  const voto = await prisma.voto.upsert({
    where: { votacionId_unidadId: { votacionId: votacion.id, unidadId: unidad.id } },
    update: { opcion: parsed.data.opcion },
    create: { votacionId: votacion.id, unidadId: unidad.id, opcion: parsed.data.opcion },
  });

  res.json(voto);
});
