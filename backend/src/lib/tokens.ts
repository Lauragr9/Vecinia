import { randomBytes } from "crypto";
import { prisma } from "./prisma.js";
import type { TokenPurpose } from "../generated/prisma/enums.js";

const TOKEN_TTL_HOURS = 48;

export async function createToken(userId: string, purpose: TokenPurpose) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

  await prisma.verificationToken.create({
    data: { userId, token, purpose, expiresAt },
  });

  return token;
}

export async function consumeToken(token: string, purpose: TokenPurpose) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.purpose !== purpose || record.expiresAt < new Date()) {
    return null;
  }

  await prisma.verificationToken.deleteMany({ where: { userId: record.userId, purpose } });

  return record.user;
}
