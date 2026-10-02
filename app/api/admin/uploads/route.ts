import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_FILES = 5;

function imageType(bytes: Uint8Array) {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "webp";
  return null;
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  try {
    const form = await request.formData();
    const files = form.getAll("files").filter((entry): entry is File => entry instanceof File);
    if (!files.length || files.length > MAX_FILES) return NextResponse.json({ error: "Selecciona de 1 a 5 imágenes." }, { status: 400 });

    const directory = path.join(process.cwd(), "public", "uploads", "books");
    await mkdir(directory, { recursive: true });
    const urls: string[] = [];

    for (const file of files) {
      if (file.size < 1 || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Cada imagen debe pesar menos de 4 MB." }, { status: 400 });
      const bytes = new Uint8Array(await file.arrayBuffer());
      const extension = imageType(bytes);
      if (!extension) return NextResponse.json({ error: "Usa imágenes JPG, PNG o WebP válidas." }, { status: 400 });
      const name = `${randomUUID()}.${extension}`;
      await writeFile(path.join(directory, name), bytes, { flag: "wx" });
      urls.push(`/uploads/books/${name}`);
    }

    return NextResponse.json({ urls });
  } catch {
    return NextResponse.json({ error: "No se pudieron subir las imágenes." }, { status: 500 });
  }
}
