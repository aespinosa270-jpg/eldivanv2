"use client";
import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/components/cart-provider";
export default function AddToCartButton({ bookId }: { bookId: string }) { const { add } = useCart(); const [added, setAdded] = useState(false); return <button type="button" aria-label="Agregar al carrito" onClick={() => { add(bookId); setAdded(true); window.setTimeout(() => setAdded(false), 1200); }} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D2E4B] text-white transition hover:bg-[#2C4263]">{added?<Check size={16}/>:<ShoppingCart size={16}/>}</button>; }
