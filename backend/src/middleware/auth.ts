import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../lib/jwt.js";
import { HttpError } from "./error-handler.js";
import type { Role } from "../generated/prisma/enums.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    next(new HttpError(401, "No autenticado."));
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    next(new HttpError(401, "No autenticado."));
    return;
  }

  req.user = { id: user.id, email: user.email, nombre: user.nombre };
  next();
}

export async function requireMembership(userId: string, comunidadId: string, roles?: Role[]) {
  const membership = await prisma.membership.findUnique({
    where: { userId_comunidadId: { userId, comunidadId } },
  });

  if (!membership) {
    throw new HttpError(403, "No perteneces a esta comunidad.");
  }

  if (roles && !roles.includes(membership.role)) {
    throw new HttpError(403, "No tienes permiso para realizar esta acción.");
  }

  return membership;
}

export async function requireAdmin(userId: string, comunidadId: string) {
  return requireMembership(userId, comunidadId, ["ADMIN"]);
}
