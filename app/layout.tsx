import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import CookieConsent from "@/components/cookie-consent";

export const metadata: Metadata = {
  title: "El Diván | Mundo Psicoanalítico",
  description:
    "Librería especializada en psicoanálisis, clínica y pensamiento contemporáneo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body><CartProvider>{children}<CookieConsent /></CartProvider></body>
    </html>
  );
}
