import "server-only";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export async function saveUploadedFile(file: File, subdir: string): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const fileName = `${randomUUID()}-${safeName}`;
  const dir = path.join(UPLOAD_ROOT, subdir);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), bytes);
  return `/uploads/${subdir}/${fileName}`;
}
