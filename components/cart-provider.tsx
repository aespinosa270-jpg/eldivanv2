"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = { bookId: string; quantity: number };
type CartApi = { lines: CartLine[]; count: number; add: (bookId: string) => void; setQuantity: (bookId: string, quantity: number) => void; remove: (bookId: string) => void; clear: () => void };
const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { const saved = localStorage.getItem("eldivan-cart"); if (saved) setLines(JSON.parse(saved)); } catch { localStorage.removeItem("eldivan-cart"); } setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem("eldivan-cart", JSON.stringify(lines)); }, [lines, ready]);
  const add = useCallback((bookId: string) => setLines((current) => { const line = current.find((item) => item.bookId === bookId); return line ? current.map((item) => item.bookId === bookId ? { ...item, quantity: Math.min(item.quantity + 1, 10) } : item) : [...current, { bookId, quantity: 1 }]; }), []);
  const setQuantity = useCallback((bookId: string, quantity: number) => setLines((current) => quantity < 1 ? current.filter((item) => item.bookId !== bookId) : current.map((item) => item.bookId === bookId ? { ...item, quantity: Math.min(quantity, 10) } : item)), []);
  const remove = useCallback((bookId: string) => setLines((current) => current.filter((item) => item.bookId !== bookId)), []);
  const clear = useCallback(() => setLines([]), []);
  const value = useMemo(() => ({ lines, count: lines.reduce((sum, line) => sum + line.quantity, 0), add, setQuantity, remove, clear }), [lines, add, setQuantity, remove, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error("CartProvider is missing."); return value; }
