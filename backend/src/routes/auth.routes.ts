import { Router } from "express";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/jwt.js";
import { requireAuth } from "../middleware/auth.js";
import { HttpError } from "../middleware/error-handler.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, "Email o contraseña no válidos.");
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError(401, "Email o contraseña incorrectos.");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, "Email o contraseña incorrectos.");
  }

  const token = signToken(user.id);
  res.json({
    token,
    user: { id: user.id, email: user.email, nombre: user.nombre },
  });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const memberships = await prisma.membership.findMany({
    where: { userId: req.user!.id },
    include: { comunidad: true },
    orderBy: { comunidad: { nombre: "asc" } },
  });

  res.json({ user: req.user, memberships });
});
