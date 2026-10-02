"use client";

import { useState } from "react";
import { BadgePercent, Check, Eye, Megaphone, Palette, Plus, Save } from "lucide-react";
import type { PromotionCoupon, SiteSettings } from "@/lib/admin-data";

const paletteColors = { navy: "#1D2E4B", beige: "#D8C9B3", olive: "#67745B" };
export default function AdminPromotions({ initialCoupons, initialSettings }: { initialCoupons: PromotionCoupon[]; initialSettings: SiteSettings }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [settings, setSettings] = useState(initialSettings);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function createCoupon(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const formElement = event.currentTarget; setBusy(true); setError(""); setNotice("");
    const form = new FormData(formElement);
    const response = await fetch("/api/admin/promotions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: form.get("code"), percent: form.get("percent"), startsAt: form.get("startsAt"), expiresAt: form.get("expiresAt"), usageLimit: form.get("usageLimit") }) });
    const result = await response.json(); setBusy(false);
    if (!response.ok) { setError(result.error || "No se pudo guardar el cupón."); return; }
    setCoupons((current) => [result.coupon, ...current]); setNotice("Cupón de promoción creado."); formElement.reset();
  }
  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    const response = await fetch("/api/admin/site-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    const result = await response.json(); setBusy(false);
    if (!response.ok) { setError(result.error || "No se pudo guardar la apariencia."); return; }
    setSettings(result.settings); setNotice("Cambios guardados. La tienda ya muestra la nueva configuración.");
  }
  async function toggle(coupon: PromotionCoupon) {
    const response = await fetch("/api/admin/promotions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: coupon.id, active: !coupon.active }) });
    const result = await response.json();
    if (!response.ok) { setError(result.error || "No se pudo actualizar."); return; }
    setCoupons((current) => current.map((item) => item.id === coupon.id ? result.coupon : item));
  }
  const patch = (area: "promotion" | "hero", key: string, value: string | boolean) => setSettings((current) => ({ ...current, [area]: { ...current[area], [key]: value } }));
  return <div className="admin-promo-page">
    <div className="admin-heading"><div><p className="admin-eyebrow">OFERTAS Y CONTENIDO DESTACADO</p><h1 className="editorial-serif">Promociones y apariencia</h1><p className="admin-muted">Crea códigos de descuento y actualiza el mensaje principal de la tienda.</p></div></div>
    {notice&&<div className="admin-notice" role="status"><Check size={16}/>{notice}</div>}{error&&<p className="admin-error" role="alert">{error}</p>}
    <div className="admin-promo-columns"><section className="admin-panel admin-promo-card"><div className="admin-panel-title"><div><h2><BadgePercent size={16}/> Cupones promocionales</h2><p>Códigos generales con vigencia y límite de usos.</p></div></div><form className="admin-promo-form" onSubmit={createCoupon}><label>Código<input name="code" required minLength={4} maxLength={24} pattern="[A-Za-z0-9_-]+" placeholder="OTOÑO10"/></label><label>Descuento (%)<input name="percent" type="number" min="1" max="80" defaultValue="10" required/></label><label>Válido desde<input name="startsAt" type="date" defaultValue={new Date().toISOString().slice(0,10)} required/></label><label>Válido hasta<input name="expiresAt" type="date" required/></label><label>Máximo de usos<input name="usageLimit" type="number" min="1" max="100000" defaultValue="100" required/></label><button className="admin-primary" disabled={busy}><Plus size={15}/> Crear cupón</button></form><div className="admin-promo-list">{coupons.length?coupons.map(coupon=><article key={coupon.id}><span className="admin-promo-code"><b>{coupon.code}</b><small>{coupon.percent}% · hasta {coupon.expiresAt} · {coupon.uses}/{coupon.usageLimit} usos</small></span><button className={`admin-promo-toggle ${coupon.active?"on":""}`} onClick={()=>toggle(coupon)}>{coupon.active?"Activo":"Pausado"}</button></article>):<p className="admin-empty">Todavía no hay cupones promocionales.</p>}</div></section>
    <section className="admin-panel admin-promo-card"><div className="admin-panel-title"><div><h2><Megaphone size={16}/> Banner de promoción</h2><p>El banner se muestra sobre el encabezado de la página principal.</p></div></div><form className="admin-settings-form" onSubmit={saveSettings}><label className="admin-switch"><input type="checkbox" checked={settings.promotion.enabled} onChange={(e)=>patch("promotion","enabled",e.target.checked)}/> Mostrar banner</label><label>Etiqueta<input value={settings.promotion.eyebrow} maxLength={45} onChange={e=>patch("promotion","eyebrow",e.target.value)} required/></label><label>Título<input value={settings.promotion.title} maxLength={100} onChange={e=>patch("promotion","title",e.target.value)} required/></label><label>Descripción<textarea value={settings.promotion.description} maxLength={220} rows={2} onChange={e=>patch("promotion","description",e.target.value)} required/></label><div className="admin-promo-fields"><label>Texto del botón<input value={settings.promotion.buttonLabel} maxLength={30} onChange={e=>patch("promotion","buttonLabel",e.target.value)} required/></label><label>Enlace interno<input value={settings.promotion.href} onChange={e=>patch("promotion","href",e.target.value)} placeholder="/catalogo" required/></label></div><label>Color del banner<select value={settings.promotion.palette} onChange={e=>patch("promotion","palette",e.target.value)}><option value="navy">Azul marino</option><option value="beige">Beige</option><option value="olive">Oliva</option></select></label><button className="admin-primary" disabled={busy}><Save size={15}/> Guardar banner</button></form><div className={`admin-banner-preview ${settings.promotion.palette}`}><small>{settings.promotion.eyebrow}</small><b>{settings.promotion.title}</b><span>{settings.promotion.description}</span><em>{settings.promotion.buttonLabel} →</em></div></section></div>
    <section className="admin-panel admin-promo-card admin-theme-panel"><div className="admin-panel-title"><div><h2><Palette size={16}/> Mensaje de portada</h2><p>Actualiza el texto principal y el tono de acento, conservando la identidad editorial.</p></div><Eye size={17}/></div><form className="admin-settings-form admin-hero-settings" onSubmit={saveSettings}><label>Título de portada<input value={settings.hero.title} maxLength={100} onChange={e=>patch("hero","title",e.target.value)} required/></label><label>Descripción<input value={settings.hero.description} maxLength={220} onChange={e=>patch("hero","description",e.target.value)} required/></label><label>Color de acento<select value={settings.hero.accent} onChange={e=>patch("hero","accent",e.target.value)}><option value="beige">Beige clásico</option><option value="olive">Oliva</option><option value="rose">Rosa empolvado</option></select></label><button className="admin-primary" disabled={busy}><Save size={15}/> Guardar portada</button></form></section>
  </div>;
}
