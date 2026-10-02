import type { ReactNode } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export type LegalSection = { title: string; paragraphs?: string[]; bullets?: string[]; content?: ReactNode };

export default function LegalPage({ title, intro, sections, updated = "2 de octubre de 2026" }: { title: string; intro: string; sections: LegalSection[]; updated?: string }) {
  return <><Header/><main className="legal-main"><div className="page-shell"><header className="legal-heading"><p className="admin-eyebrow">EL DIVÁN · INFORMACIÓN LEGAL</p><h1 className="editorial-serif">{title}</h1><p>{intro}</p><small>Última actualización: {updated}</small></header><div className="legal-content">{sections.map((section,index)=><section key={`${section.title}-${index}`}><h2 className="editorial-serif">{section.title}</h2>{section.paragraphs?.map((paragraph,i)=><p key={i}>{paragraph}</p>)}{section.bullets&&<ul>{section.bullets.map((bullet,i)=><li key={i}>{bullet}</li>)}</ul>}{section.content}</section>)}</div></div></main><Footer/></>;
}
