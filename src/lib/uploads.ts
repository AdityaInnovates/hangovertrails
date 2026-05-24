import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { env } from "@/lib/env";

const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
const maxFileSize = 5 * 1024 * 1024;

export type StoredUpload = {
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
};

export async function storeAadhaarFile(file: File, bookingCode: string): Promise<StoredUpload> {
  if (!allowedMimeTypes.has(file.type)) {
    throw new Error("Aadhaar upload must be a PDF, JPG, or PNG file.");
  }

  if (file.size > maxFileSize) {
    throw new Error("Aadhaar upload must be 5 MB or smaller.");
  }

  const extension = file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : "jpg";
  const safeCode = bookingCode.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const fileName = `${safeCode}-${Date.now()}.${extension}`;
  const uploadDir = path.resolve(/*turbopackIgnore: true*/ process.cwd(), env.UPLOAD_DIR);
  const absolutePath = path.join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()));

  return {
    fileName,
    filePath: path.relative(process.cwd(), absolutePath),
    mimeType: file.type,
    fileSize: file.size,
  };
}