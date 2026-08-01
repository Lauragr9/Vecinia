import { Router } from "express";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/jwt.js";
import { requireAuth } from "../middleware/auth.js";
import { HttpError } from "../middleware/error-handler.js";
import { createToken, consumeToken } from "../lib/tokens.js";
import { sendVerificationEmail } from "../lib/email.js";

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

  if (!user.emailVerified) {
    throw new HttpError(403, "Todavía no has confirmado tu cuenta. Revisa tu email.");
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

const registerSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio."),
  email: z.email("Email no válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const { nombre, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new HttpError(409, "Ya existe una cuenta con ese email.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { nombre, email, passwordHash, emailVerified: false },
  });

  const token = await createToken(user.id, "VERIFY_EMAIL");
  await sendVerificationEmail(user.email, user.nombre, token);

  res.status(201).json({ message: "Cuenta creada. Revisa tu email para confirmarla." });
});

const tokenSchema = z.object({ token: z.string().min(1, "Token no válido.") });

authRouter.post("/verify-email", async (req, res) => {
  const parsed = tokenSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, "Enlace no válido.");
  }

  const user = await consumeToken(parsed.data.token, "VERIFY_EMAIL");
  if (!user) {
    throw new HttpError(400, "El enlace de verificación no es válido o ha caducado.");
  }

  await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });

  const jwt = signToken(user.id);
  res.json({ token: jwt, user: { id: user.id, email: user.email, nombre: user.nombre } });
});

const acceptInviteSchema = z.object({
  token: z.string().min(1),
  nombre: z.string().trim().min(2, "El nombre es obligatorio."),
  telefono: z.string().trim().optional(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

authRouter.post("/accept-invite", async (req, res) => {
  const parsed = acceptInviteSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const user = await consumeToken(parsed.data.token, "INVITE");
  if (!user) {
    throw new HttpError(400, "El enlace de invitación no es válido o ha caducado.");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      nombre: parsed.data.nombre,
      telefono: parsed.data.telefono || undefined,
      passwordHash,
      emailVerified: true,
    },
  });

  const jwt = signToken(updated.id);
  res.json({ token: jwt, user: { id: updated.id, email: updated.email, nombre: updated.nombre } });
});

// Recibo un email conocido y, si aplica, reenvío el email de verificación.
// Responde siempre igual para no revelar qué emails existen en el sistema.
const resendSchema = z.object({ email: z.email() });

authRouter.post("/resend-verification", async (req, res) => {
  const parsed = resendSchema.safeParse(req.body);
  if (parsed.success) {
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (user && !user.emailVerified) {
      const token = await createToken(user.id, "VERIFY_EMAIL");
      await sendVerificationEmail(user.email, user.nombre, token);
    }
  }

  res.json({ message: "Si el email existe y está pendiente de confirmar, te hemos enviado un nuevo enlace." });
});
