import { Router } from "express";
import multer from "multer";
import * as z from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireMembership } from "../middleware/auth.js";
import { HttpError } from "../middleware/error-handler.js";
import { saveUploadedFile } from "../lib/storage.js";

export const incidenciasRouter = Router();
incidenciasRouter.use(requireAuth);

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

incidenciasRouter.get("/comunidades/:id/incidencias", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId);

  const incidencias = await prisma.incidencia.findMany({
    where: { comunidadId },
    include: { unidad: true, creadoPor: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(incidencias);
});

const createSchema = z.object({
  titulo: z.string().trim().min(2, "El título es obligatorio."),
  descripcion: z.string().trim().min(2, "La descripción es obligatoria."),
  unidadId: z.string().trim().optional(),
});

incidenciasRouter.post("/comunidades/:id/incidencias", upload.array("fotos", 6), async (req, res) => {
  const comunidadId = String(req.params.id);
  await requireMembership(req.user!.id, comunidadId);

  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const fotos: string[] = [];
  for (const file of files) {
    fotos.push(await saveUploadedFile(file, `incidencias/${comunidadId}`));
  }

  const incidencia = await prisma.incidencia.create({
    data: {
      comunidadId,
      unidadId: parsed.data.unidadId || undefined,
      titulo: parsed.data.titulo,
      descripcion: parsed.data.descripcion,
      creadoPorId: req.user!.id,
      fotos,
    },
  });

  res.status(201).json(incidencia);
});

incidenciasRouter.get("/incidencias/:id", async (req, res) => {
  const incidencia = await prisma.incidencia.findUnique({
    where: { id: req.params.id },
    include: {
      unidad: true,
      creadoPor: true,
      comentarios: { include: { autor: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!incidencia) throw new HttpError(404, "Incidencia no encontrada.");
  await requireMembership(req.user!.id, incidencia.comunidadId);

  res.json(incidencia);
});

const estadoSchema = z.object({ estado: z.enum(["PENDIENTE", "EN_PROCESO", "RESUELTO"]) });

incidenciasRouter.patch("/incidencias/:id/estado", async (req, res) => {
  const incidencia = await prisma.incidencia.findUnique({ where: { id: req.params.id } });
  if (!incidencia) throw new HttpError(404, "Incidencia no encontrada.");
  await requireMembership(req.user!.id, incidencia.comunidadId, ["ADMIN", "PRESIDENTE"]);

  const parsed = estadoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, "Estado no válido.");
  }

  const updated = await prisma.incidencia.update({
    where: { id: incidencia.id },
    data: { estado: parsed.data.estado },
  });

  res.json(updated);
});

const comentarioSchema = z.object({ texto: z.string().trim().min(1, "Escribe un comentario.") });

incidenciasRouter.post("/incidencias/:id/comentarios", async (req, res) => {
  const incidencia = await prisma.incidencia.findUnique({ where: { id: req.params.id } });
  if (!incidencia) throw new HttpError(404, "Incidencia no encontrada.");
  await requireMembership(req.user!.id, incidencia.comunidadId);

  const parsed = comentarioSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const comentario = await prisma.incidenciaComentario.create({
    data: { incidenciaId: incidencia.id, autorId: req.user!.id, texto: parsed.data.texto },
    include: { autor: true },
  });

  res.status(201).json(comentario);
});
