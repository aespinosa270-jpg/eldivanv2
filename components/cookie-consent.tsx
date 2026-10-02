"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const STORAGE_KEY = "eldivan-cookie-choice";
const OPEN_PREFERENCES_EVENT = "eldivan:open-cookie-preferences";

export default function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try { setVisible(!localStorage.getItem(STORAGE_KEY)); } catch { setVisible(true); }
    const reopen = () => setVisible(true);
    window.addEventListener(OPEN_PREFERENCES_EVENT, reopen);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, reopen);
  }, []);
  function choose(choice: "necessary" | "optional-rejected") {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, savedAt: new Date().toISOString() })); }
    finally { setVisible(false); }
  }
  if (!visible || pathname.startsWith("/administracion")) return null;
  return <aside className="cookie-consent" role="dialog" aria-modal="false" aria-labelledby="cookie-consent-title"><div className="cookie-consent-copy"><p className="admin-eyebrow">TU PRIVACIDAD EN EL DIVÁN</p><h2 id="cookie-consent-title">Usamos almacenamiento necesario</h2><p>Las cookies esenciales mantienen tu sesión. El carrito se guarda en este dispositivo. Actualmente no activamos cookies de analítica ni publicidad.</p><Link href="/politica-de-cookies">Leer política de cookies</Link></div><div className="cookie-consent-actions"><button type="button" className="cookie-reject" onClick={() => choose("optional-rejected")}>Rechazar opcionales</button><button type="button" className="cookie-accept" onClick={() => choose("necessary")}>Aceptar necesarias</button></div></aside>;
}
