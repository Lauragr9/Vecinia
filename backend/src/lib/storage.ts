import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

export async function saveUploadedFile(file: Express.Multer.File, subdir: string): Promise<string> {
  const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const fileName = `${randomUUID()}-${safeName}`;
  const dir = path.join(UPLOAD_ROOT, subdir);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), file.buffer);
  return `/uploads/${subdir}/${fileName}`;
}
