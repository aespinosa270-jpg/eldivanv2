"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";

export default function Newsletter() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; setBusy(true); setStatus("");
    const data = new FormData(form);
    const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: data.get("name"), email: data.get("email"), consent: data.get("consent") === "on" }) });
    const result = await response.json(); setBusy(false);
    if (!response.ok) { setStatus(result.error || "No se pudo registrar."); return; }
    form.reset(); setStatus("Autorización registrada. Los correos estarán disponibles cuando habilitemos el servicio.");
  }
  return (
    <section className="bg-[#1D2E4B] text-white">

      <div className="page-shell flex flex-col gap-6 py-6 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-10 w-10 items-center justify-center text-[#D8C9B3]">
            <Mail size={24} />
          </div>

          <div>
            <h2 className="editorial-serif text-[25px]">
              Recibe novedades y ofertas
            </h2>

            <p className="mt-1 text-[10px] text-white/45">
              Suscríbete a nuestro boletín y entérate primero.
            </p>
          </div>

        </div>

        <form onSubmit={subscribe} className="grid w-full max-w-xl gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input name="name" type="text" maxLength={100} placeholder="Tu nombre (opcional)" className="h-11 min-w-0 bg-white px-4 text-xs text-[#1D2E4B] outline-none" />
          <input
            name="email"
            type="email"
            required
            placeholder="Tu correo electrónico"
            className="h-11 min-w-0 flex-1 bg-white px-5 text-xs text-[#1D2E4B] outline-none"
          />

          <button
            disabled={busy}
            className="h-11 bg-[#D8C9B3] px-7 text-xs font-bold text-[#1D2E4B] transition hover:bg-[#EEE6DA]"
          >
            {busy ? "Guardando…" : "Suscribirme"}
          </button>
          <label className="col-span-full flex items-start gap-2 text-[10px] leading-4 text-white/75"><input type="checkbox" name="consent" required className="mt-0.5 accent-[#D8C9B3]" />Acepto que El Diván utilice mi correo para enviarme novedades y promociones.</label>
          {status && <p role="status" className="col-span-full text-[10px] text-[#EEE6DA]">{status}</p>}
        </form>

      </div>

    </section>
  );
}

