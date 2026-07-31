import { Router } from "express";
import multer from "multer";
import * as z from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireMembership } from "../middleware/auth.js";
import { HttpError } from "../middleware/error-handler.js";
import { saveUploadedFile } from "../lib/storage.js";

export const documentosRouter = Router();
documentosRouter.use(requireAuth);

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

documentosRouter.get("/comunidades/:id/documentos", async (req, res) => {
  const comunidadId = req.params.id;
  await requireMembership(req.user!.id, comunidadId);

  const query = typeof req.query.q === "string" ? req.query.q : undefined;

  const documentos = await prisma.documento.findMany({
    where: {
      comunidadId,
      ...(query
        ? {
            OR: [
              { nombre: { contains: query, mode: "insensitive" } },
              { categoria: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(documentos);
});

const documentoSchema = z.object({
  categoria: z.string().trim().min(1, "Selecciona una categoría."),
  nombre: z.string().trim().min(1, "El nombre es obligatorio."),
});

documentosRouter.post("/comunidades/:id/documentos", upload.single("archivo"), async (req, res) => {
  const comunidadId = String(req.params.id);
  await requireMembership(req.user!.id, comunidadId, ["ADMIN", "PRESIDENTE"]);

  const parsed = documentoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }
  if (!req.file) {
    throw new HttpError(400, "Selecciona un archivo.");
  }

  const url = await saveUploadedFile(req.file, `documentos/${comunidadId}`);

  const documento = await prisma.documento.create({
    data: {
      comunidadId,
      categoria: parsed.data.categoria,
      nombre: parsed.data.nombre,
      url,
      subidoPorId: req.user!.id,
    },
  });

  res.status(201).json(documento);
});
