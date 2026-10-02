"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";

export default function RestockForm({ bookId }: { bookId: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return <div className="mt-2">
    {!open ? <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-1 text-[9px] font-semibold text-[#766447] hover:underline"><Bell size={12}/> Avísame cuando vuelva</button> : <form className="grid gap-1.5" onSubmit={async (event) => { event.preventDefault(); setBusy(true); setMessage(""); const form = new FormData(event.currentTarget); const response = await fetch("/api/restock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), bookId }) }); const result = await response.json(); setBusy(false); setMessage(response.ok ? "Listo, te avisaremos cuando vuelva." : result.error || "No pudimos registrar tu solicitud."); if (response.ok) setOpen(false); }}><input name="name" placeholder="Tu nombre" required minLength={2} maxLength={100} className="h-8 rounded border border-[#1D2E4B]/15 px-2 text-[10px] outline-none"/><input name="email" type="email" placeholder="Tu correo" required maxLength={254} className="h-8 rounded border border-[#1D2E4B]/15 px-2 text-[10px] outline-none"/><button disabled={busy} className="flex h-8 items-center justify-center gap-1 rounded bg-[#1D2E4B] px-2 text-[9px] font-bold text-white">{busy ? "Guardando…" : "Avisarme"}</button>{message&&<p role="status" className="text-[9px] text-[#52705B]">{message}</p>}</form>}
  </div>;
}
