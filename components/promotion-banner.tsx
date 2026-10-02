import Link from "next/link";
import type { SiteSettings } from "@/lib/admin-data";

const palettes = {
  navy: { background: "#13223A", color: "#FFFFFF", accent: "#D8C9B3" },
  beige: { background: "#D8C9B3", color: "#1D2E4B", accent: "#1D2E4B" },
  olive: { background: "#67745B", color: "#FFFFFF", accent: "#EEE6DA" },
};
export default function PromotionBanner({ promotion }: { promotion: SiteSettings["promotion"] }) {
  if (!promotion.enabled) return null;
  const colors = palettes[promotion.palette];
  return <section className="promotion-banner" style={{ backgroundColor: colors.background, color: colors.color }}><div className="page-shell promotion-banner-inner"><div><span style={{ color: colors.accent }}>{promotion.eyebrow}</span><b>{promotion.title}</b><p>{promotion.description}</p></div><Link href={promotion.href} style={{ color: colors.background, backgroundColor: colors.accent }}>{promotion.buttonLabel} →</Link></div></section>;
}
