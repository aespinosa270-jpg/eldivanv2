"use client";
import { useCart } from "@/components/cart-provider";
export default function CartCount() { const { count } = useCart(); return <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#D8C9B3] px-1 text-[9px] font-black text-[#1D2E4B]">{count}</span>; }
