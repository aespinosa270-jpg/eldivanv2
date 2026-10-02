"use client";

export default function CookiePreferencesButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("eldivan:open-cookie-preferences"))} className="w-fit text-left text-sm text-white/55 transition hover:text-white">Preferencias de cookies</button>;
}
