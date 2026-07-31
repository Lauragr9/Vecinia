import { Router } from "express";
import * as z from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireMembership } from "../middleware/auth.js";
import { HttpError } from "../middleware/error-handler.js";

export const anunciosRouter = Router();
anunciosRouter.use(requireAuth);

anunciosRouter.get("/comunidades/:id/anuncios", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId);

  const anuncios = await prisma.anuncio.findMany({
    where: { comunidadId },
    include: { autor: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(anuncios);
});

const anuncioSchema = z.object({
  titulo: z.string().trim().min(2, "El título es obligatorio."),
  cuerpo: z.string().trim().min(2, "El contenido es obligatorio."),
});

anunciosRouter.post("/comunidades/:id/anuncios", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId, ["ADMIN", "PRESIDENTE"]);

  const parsed = anuncioSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const anuncio = await prisma.anuncio.create({
    data: { comunidadId, ...parsed.data, autorId: req.user!.id },
    include: { autor: true },
  });

  res.status(201).json(anuncio);
});
