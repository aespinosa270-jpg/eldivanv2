import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { saveSiteSettings, type SiteSettings } from "@/lib/admin-data";

const palettes = ["navy", "beige", "olive"] as const;
const accents = ["beige", "olive", "rose"] as const;
export async function PUT(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const body = await request.json();
  const settings: SiteSettings = {
    promotion: {
      enabled: Boolean(body.promotion?.enabled),
      eyebrow: String(body.promotion?.eyebrow || "").trim().slice(0, 45),
      title: String(body.promotion?.title || "").trim().slice(0, 100),
      description: String(body.promotion?.description || "").trim().slice(0, 220),
      buttonLabel: String(body.promotion?.buttonLabel || "").trim().slice(0, 30),
      href: String(body.promotion?.href || "/catalogo").trim(),
      palette: palettes.includes(body.promotion?.palette) ? body.promotion.palette : "navy",
    },
    hero: {
      title: String(body.hero?.title || "").trim().slice(0, 100),
      description: String(body.hero?.description || "").trim().slice(0, 220),
      accent: accents.includes(body.hero?.accent) ? body.hero.accent : "beige",
    },
  };
  if (!settings.promotion.eyebrow || !settings.promotion.title || !settings.promotion.description || !settings.promotion.buttonLabel || !settings.hero.title || !settings.hero.description || !settings.promotion.href.startsWith("/") || settings.promotion.href.startsWith("//")) return NextResponse.json({ error: "Completa los textos y usa un enlace interno de la tienda." }, { status: 400 });
  return NextResponse.json({ settings: await saveSiteSettings(settings) });
}
