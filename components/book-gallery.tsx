"use client";

import { useState } from "react";
import type { Book } from "@/lib/types";

export default function BookGallery({ book }: { book: Book }) {
  const images = [book.coverImage, ...(book.productImages ?? [])].filter((image): image is string => Boolean(image));
  const [active, setActive] = useState(images[0]);
  if (!images.length) return <div className="book-gallery-empty editorial-serif">{book.title}<small>{book.author}</small></div>;
  return <div className="book-gallery"><div className="book-gallery-main"><img src={active} alt={`Imagen de ${book.title}`}/></div>{images.length>1&&<div className="book-gallery-thumbs">{images.map((image,index)=><button key={image} className={active===image?"active":""} onClick={()=>setActive(image)} aria-label={`Ver imagen ${index+1}`}><img src={image} alt=""/></button>)}</div>}</div>;
}
