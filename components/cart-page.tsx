"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BadgePercent, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import type { Book } from "@/lib/types";
import { useCart } from "@/components/cart-provider";

const money = (n: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
export default function CartPage({ books, customer }: { books: Book[]; customer: { name: string; email: string } | null }) {
  const cart = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState<{ id: string; total: number } | null>(null);
  const lines = useMemo(() => cart.lines.flatMap((line) => { const book = books.find((item) => item.id === line.bookId); return book ? [{ ...line, book }] : []; }), [cart.lines, books]);
  const subtotal = lines.reduce((sum, line) => sum + line.book.price * line.quantity, 0);
  const discount = coupon ? Math.round(subtotal * coupon.percent) / 100 : 0;
  useEffect(() => {
    if (!customer || !lines.length || complete) return;
    const timer = window.setTimeout(() => {
      void fetch("/api/account/cart-activity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: lines.map(({ bookId, quantity }) => ({ bookId, quantity })) }) });
    }, 700);
    return () => window.clearTimeout(timer);
  }, [customer, lines, complete]);
  if (complete) return <section className="cart-success"><span><ShoppingBag size={24}/></span><p className="admin-eyebrow">PEDIDO RECIBIDO</p><h1 className="editorial-serif">Gracias por tu compra</h1><p>Tu pedido <b>{complete.id}</b> quedó registrado por {money(complete.total)}. El pago aparece como pendiente para que la tienda pueda confirmarlo.</p><Link href="/cuenta" className="admin-primary">Consultar mi pedido</Link><Link href="/catalogo" className="cart-back-link">Seguir explorando</Link></section>;
  if (!lines.length) return <section className="cart-empty"><span><ShoppingBag size={25}/></span><h1 className="editorial-serif">Tu carrito está vacío</h1><p>Encuentra un libro para comenzar.</p><Link href="/catalogo" className="admin-primary">Explorar catálogo</Link></section>;
  async function applyCoupon() {
    setCouponError(""); setCoupon(null);
    const response = await fetch("/api/account/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: couponCode }) });
    const result = await response.json();
    if (!response.ok) { setCouponError(result.error || "No se pudo validar el cupón."); return; }
    setCoupon(result);
  }
  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!customer) return;
    setBusy(true); setError("");
    const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address, couponCode: coupon?.code, items: lines.map(({ bookId, quantity }) => ({ bookId, quantity })) }) });
    const result = await response.json(); setBusy(false);
    if (!response.ok) { setError(result.error || "No se pudo confirmar el pedido."); return; }
    cart.clear(); setComplete({ id: result.order.id, total: result.order.total });
  }
  return <><div className="cart-title"><div><p className="admin-eyebrow">EL DIVÁN · COMPRA</p><h1 className="editorial-serif">Tu carrito</h1></div><Link href="/catalogo" className="cart-back-link"><ArrowLeft size={14}/> Volver al catálogo</Link></div><div className="cart-layout"><section className="cart-lines">{lines.map(({ book, quantity })=><article className="cart-line" key={book.id}><div className="cart-cover">{book.coverImage ? <img src={book.coverImage} alt={`Portada de ${book.title}`}/> : book.title}</div><div className="cart-line-info"><b>{book.title}</b><small>{book.author} · {book.publisher}</small><span>{book.stock} disponibles</span><div className="cart-quantity"><button onClick={()=>cart.setQuantity(book.id,quantity-1)} aria-label="Disminuir"><Minus size={13}/></button><b>{quantity}</b><button disabled={quantity>=10||quantity>=book.stock} onClick={()=>cart.setQuantity(book.id,quantity+1)} aria-label="Aumentar"><Plus size={13}/></button><button className="cart-remove" onClick={()=>cart.remove(book.id)} aria-label="Quitar"><Trash2 size={14}/></button></div></div><b className="cart-line-price">{money(book.price*quantity)}</b></article>)}</section><aside className="cart-summary"><h2>Resumen</h2><div className="cart-coupon"><label htmlFor="coupon">Cupón de lealtad</label><div><input id="coupon" value={couponCode} onChange={e=>setCouponCode(e.target.value.toUpperCase())} placeholder="DIVAN10-…"/><button type="button" onClick={applyCoupon} disabled={!customer||!couponCode}>Aplicar</button></div>{!customer&&<small>Inicia sesión para usar un cupón personal.</small>}{couponError&&<small className="cart-error">{couponError}</small>}{coupon&&<small className="cart-coupon-ok"><BadgePercent size={13}/> Cupón aplicado: {coupon.percent}%</small>}</div><div className="cart-totals"><p><span>Subtotal</span><b>{money(subtotal)}</b></p>{coupon&&<p><span>Descuento</span><b>−{money(discount)}</b></p>}<p className="cart-grand-total"><span>Total</span><b>{money(subtotal-discount)}</b></p><small>El costo del envío se confirmará después según tu dirección.</small></div>{customer?<form className="cart-checkout" onSubmit={submitOrder}><label>Entrega para<input readOnly value={`${customer.name} · ${customer.email}`}/></label><label>Dirección de envío<textarea value={address} onChange={e=>setAddress(e.target.value)} minLength={8} required rows={3} placeholder="Calle, número, colonia, ciudad y código postal"/></label>{error&&<p className="cart-error" role="alert">{error}</p>}<button className="admin-primary" disabled={busy}>{busy?"Creando pedido…":"Confirmar pedido"}</button><small>El pedido quedará pendiente de confirmación de pago. Las existencias se reservan al confirmar.</small></form>:<div className="cart-sign-in"><p>Inicia sesión o crea una cuenta para completar tu compra.</p><Link href="/cuenta" className="admin-primary">Ir a mi cuenta</Link></div>}</aside></div></>;
}
