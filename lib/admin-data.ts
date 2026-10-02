import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { books as initialBooks } from "@/data/books";
import type { Book } from "@/lib/types";

export type OrderStatus = "Pendiente" | "Procesando" | "Enviado" | "Entregado" | "Cancelado";
export type PaymentStatus = "Pendiente" | "Pagado" | "Reembolsado";
export type AdminOrder = {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  subtotal?: number;
  discount?: number;
  couponCode?: string;
  couponType?: "reward" | "promotion";
  stockReserved?: boolean;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  tracking: string;
  carrier: string;
  address: string;
  items: { bookId: string; title: string; quantity: number; unitPrice: number }[];
};
export type AdminCustomer = {
  email: string;
  name: string;
  orders: AdminOrder[];
  purchasedBooks: number;
  completedBooks: number;
  earnedCoupons: number;
  nextRewardProgress: number;
};
export type RestockRequest = { id: string; bookId: string; name: string; email: string; createdAt: string };
export type RewardCoupon = { id: string; code: string; email: string; percent: number; milestone: number; createdAt: string; used: boolean; reservedOrderId?: string };
export type PromotionCoupon = { id: string; code: string; percent: number; startsAt: string; expiresAt: string; usageLimit: number; uses: number; reservedOrderIds: string[]; active: boolean; createdAt: string };
export type SiteSettings = { promotion: { enabled: boolean; eyebrow: string; title: string; description: string; buttonLabel: string; href: string; palette: "navy" | "beige" | "olive" }; hero: { title: string; description: string; accent: "beige" | "olive" | "rose" } };
export type CustomerAccount = { id: string; name: string; email: string; passwordHash: string; createdAt: string };
export type ContentPost = { id: string; kind: "articulo" | "noticia" | "instagram"; title: string; slug: string; excerpt: string; content: string; sourceUrl: string; status: "borrador" | "publicado"; createdAt: string; updatedAt: string };
export type NewsletterSubscriber = { id: string; email: string; name: string; consentedAt: string; active: boolean };
export type CampaignDraft = { id: string; name: string; kind: "novedades" | "promocion" | "carrito"; subject: string; preheader: string; body: string; status: "borrador"; createdAt: string };
export type AbandonedCart = { id: string; email: string; customer: string; items: { bookId: string; title: string; quantity: number; unitPrice: number }[]; total: number; updatedAt: string; status: "abierto" | "convertido" | "descartado" };
type Store = { books: Book[]; orders: AdminOrder[]; restockRequests: RestockRequest[]; coupons: RewardCoupon[]; promotionCoupons: PromotionCoupon[]; accounts: CustomerAccount[]; siteSettings: SiteSettings; posts: ContentPost[]; subscribers: NewsletterSubscriber[]; campaigns: CampaignDraft[]; carts: AbandonedCart[] };

const defaultSiteSettings: SiteSettings = { promotion: { enabled: false, eyebrow: "PROMOCIÓN", title: "Una buena lectura te espera", description: "Explora novedades y títulos seleccionados por El Diván.", buttonLabel: "Ver catálogo", href: "/catalogo", palette: "navy" }, hero: { title: "El psicoanálisis tiene una biblioteca.", description: "Encuentra libros por etapa del desarrollo, tema clínico, orientación teórica, autor o editorial.", accent: "beige" } };

const storePath = path.join(process.cwd(), "data", "admin-store.json");
const demoOrders: AdminOrder[] = [
  { id: "ED-1048", customer: "Mariana López", email: "mariana@example.com", date: "2026-10-01", total: 1000, paymentStatus: "Pagado", status: "Procesando", tracking: "", carrier: "", address: "Roma Norte, Ciudad de México", items: [{ bookId: "1", title: "Nacemos para siempre", quantity: 1, unitPrice: 480 }, { bookId: "2", title: "Adolescencia, cuerpo y alimentación", quantity: 1, unitPrice: 520 }] },
  { id: "ED-1047", customer: "Diego Ramírez", email: "diego@example.com", date: "2026-09-30", total: 610, paymentStatus: "Pagado", status: "Enviado", tracking: "99MX1047821", carrier: "Estafeta", address: "Centro, Guadalajara, Jalisco", items: [{ bookId: "3", title: "Autismo y clínica infantil", quantity: 1, unitPrice: 610 }] },
  { id: "ED-1046", customer: "Lucía Herrera", email: "lucia@example.com", date: "2026-09-29", total: 885, paymentStatus: "Pendiente", status: "Pendiente", tracking: "", carrier: "", address: "Del Valle, Ciudad de México", items: [{ bookId: "4", title: "Realidad y juego", quantity: 1, unitPrice: 430 }, { bookId: "6", title: "Pareja, familia y vínculos", quantity: 1, unitPrice: 455 }] },
  { id: "ED-1045", customer: "Sofía Castillo", email: "sofia@example.com", date: "2026-09-27", total: 390, paymentStatus: "Pagado", status: "Entregado", tracking: "99MX1045119", carrier: "DHL", address: "Condesa, Ciudad de México", items: [{ bookId: "5", title: "Duelo y pérdida", quantity: 1, unitPrice: 390 }] },
];

async function ensureStore(): Promise<Store> {
  await mkdir(path.dirname(storePath), { recursive: true });
  try { return JSON.parse(await readFile(storePath, "utf8")) as Store; }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const initial: Store = { books: initialBooks, orders: demoOrders, restockRequests: [], coupons: [], promotionCoupons: [], accounts: [], siteSettings: defaultSiteSettings, posts: [], subscribers: [], campaigns: [], carts: [] };
    await writeFile(storePath, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
}

async function save(store: Store) { await writeFile(storePath, JSON.stringify(store, null, 2), "utf8"); }
function migrateStore(store: Store): Store {
  store.restockRequests ||= [];
  store.coupons ||= [];
  store.promotionCoupons ||= [];
  store.accounts ||= [];
  store.siteSettings ||= defaultSiteSettings;
  store.posts ||= [];
  store.subscribers ||= [];
  store.campaigns ||= [];
  store.carts ||= [];
  store.books = store.books.map((book) => {
    const initialStock = initialBooks.find((initial) => initial.id === book.id)?.stock;
    const stock = Number.isFinite(book.stock) ? Math.max(0, book.stock) : initialStock ?? (book.available ? 8 : 0);
    return { ...book, stock, available: stock > 0 };
  });
  return store;
}
async function readStore() { return migrateStore(await ensureStore()); }
function customerRows(store: Store): AdminCustomer[] {
  const emails = new Map<string, AdminOrder[]>();
  for (const order of store.orders) {
    const key = order.email.trim().toLowerCase();
    emails.set(key, [...(emails.get(key) || []), order]);
  }
  const rows = [...emails.entries()].map(([email, orders]) => {
    const purchasedBooks = orders.filter((o) => o.paymentStatus !== "Reembolsado" && o.status !== "Cancelado").reduce((n, o) => n + o.items.reduce((a, item) => a + item.quantity, 0), 0);
    const completedBooks = orders.filter((o) => o.paymentStatus === "Pagado" && o.status === "Entregado").reduce((n, o) => n + o.items.reduce((a, item) => a + item.quantity, 0), 0);
    const earnedCoupons = store.coupons.filter((coupon) => coupon.email.toLowerCase() === email).length;
    return { email, name: orders[0]?.customer || email, orders: [...orders].sort((a,b) => b.date.localeCompare(a.date)), purchasedBooks, completedBooks, earnedCoupons, nextRewardProgress: completedBooks % 5 };
  });
  for (const account of store.accounts) {
    const existing = rows.find((row) => row.email === account.email);
    if (existing) existing.name = account.name;
    else rows.push({ email: account.email, name: account.name, orders: [], purchasedBooks: 0, completedBooks: 0, earnedCoupons: 0, nextRewardProgress: 0 });
  }
  return rows.sort((a,b) => b.purchasedBooks - a.purchasedBooks);
}
export async function getAdminSnapshot() { const store = await readStore(); return { ...store, customers: customerRows(store) }; }

export async function subscribeNewsletter(email: string, name: string) {
  const store = await readStore(); const normalized = email.trim().toLowerCase();
  const existing = store.subscribers.find((item) => item.email === normalized);
  if (existing) { existing.name = name.trim().slice(0, 100); existing.active = true; existing.consentedAt = new Date().toISOString(); await save(store); return existing; }
  const subscriber: NewsletterSubscriber = { id: randomUUID(), email: normalized, name: name.trim().slice(0, 100), consentedAt: new Date().toISOString(), active: true };
  store.subscribers.unshift(subscriber); await save(store); return subscriber;
}
export async function saveCampaign(input: Omit<CampaignDraft, "id" | "createdAt" | "status">) {
  const store = await readStore(); const campaign: CampaignDraft = { ...input, id: randomUUID(), createdAt: new Date().toISOString(), status: "borrador" };
  store.campaigns.unshift(campaign); await save(store); return campaign;
}
export async function setSubscriberActive(id: string, active: boolean) {
  const store = await readStore(); const subscriber = store.subscribers.find((item) => item.id === id);
  if (!subscriber) throw new Error("No se encontró el suscriptor.");
  subscriber.active = active; await save(store); return subscriber;
}
export async function recordAbandonedCart(input: Omit<AbandonedCart, "id" | "updatedAt" | "status">) {
  const store = await readStore(); const existing = store.carts.find((item) => item.email === input.email && item.status === "abierto");
  if (existing) { Object.assign(existing, input, { updatedAt: new Date().toISOString() }); await save(store); return existing; }
  const cart: AbandonedCart = { ...input, id: randomUUID(), updatedAt: new Date().toISOString(), status: "abierto" };
  store.carts.unshift(cart); await save(store); return cart;
}
export async function recordCustomerCart(items: { bookId: string; quantity: number }[], email: string, customer: string) {
  const store = await readStore();
  const hydrated = items.flatMap((item) => { const book = store.books.find((entry) => entry.id === item.bookId); return book ? [{ bookId: book.id, title: book.title, quantity: item.quantity, unitPrice: book.price }] : []; });
  if (!hydrated.length) return null;
  return recordAbandonedCart({ email: email.trim().toLowerCase(), customer, items: hydrated, total: hydrated.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) });
}
export async function getCatalogBooks() { return (await readStore()).books; }
export async function getSiteSettings() { return (await readStore()).siteSettings; }
export async function getPublishedPosts() { return (await readStore()).posts.filter((post) => post.status === "publicado").sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)); }
export async function saveSiteSettings(settings: SiteSettings) { const store = await readStore(); store.siteSettings = settings; await save(store); return store.siteSettings; }

export async function createPromotionCoupon(input: Omit<PromotionCoupon, "id" | "uses" | "reservedOrderIds" | "createdAt">) {
  const store = await readStore();
  const code = input.code.trim().toUpperCase();
  if (store.coupons.some((coupon) => coupon.code.toUpperCase() === code) || store.promotionCoupons.some((coupon) => coupon.code.toUpperCase() === code)) throw new Error("Ya existe un cupón con ese código.");
  const coupon: PromotionCoupon = { ...input, code, id: randomUUID(), uses: 0, reservedOrderIds: [], createdAt: new Date().toISOString() };
  store.promotionCoupons.unshift(coupon); await save(store); return coupon;
}

export async function togglePromotionCoupon(id: string, active: boolean) {
  const store = await readStore(); const coupon = store.promotionCoupons.find((item) => item.id === id);
  if (!coupon) throw new Error("No se encontró el cupón.");
  coupon.active = active; await save(store); return coupon;
}

export async function saveContentPost(input: Omit<ContentPost, "id" | "createdAt" | "updatedAt"> & { id?: string }) {
  const store = await readStore();
  const slug = input.slug.trim().toLowerCase();
  if (store.posts.some((post) => post.slug === slug && post.id !== input.id)) throw new Error("Ya existe una publicación con ese enlace.");
  const existing = store.posts.find((post) => post.id === input.id);
  const post: ContentPost = { ...input, slug, id: existing?.id || randomUUID(), createdAt: existing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
  if (existing) store.posts = store.posts.map((item) => item.id === existing.id ? post : item); else store.posts.unshift(post);
  await save(store); return post;
}

export async function deleteContentPost(id: string) {
  const store = await readStore(); store.posts = store.posts.filter((post) => post.id !== id); await save(store);
}

export async function getPublishedPost(slug: string) {
  return (await readStore()).posts.find((post) => post.slug === slug && post.status === "publicado") || null;
}
export async function saveBook(input: Omit<Book, "id"> & { id?: string }) {
  const store = await readStore();
  const id = input.id || randomUUID();
  const stock = Math.max(0, Math.floor(Number(input.stock) || 0));
  const book: Book = { ...input, id, stock, available: stock > 0 };
  const index = store.books.findIndex((item) => item.id === id);
  if (index < 0) store.books.unshift(book); else store.books[index] = book;
  await save(store);
  return book;
}
export async function deleteBook(id: string) {
  const store = await readStore();
  if (store.orders.some((order) => order.items.some((item) => item.bookId === id))) throw new Error("Este libro aparece en pedidos y no se puede eliminar.");
  store.books = store.books.filter((book) => book.id !== id);
  await save(store);
}
export async function updateOrder(id: string, changes: Pick<AdminOrder, "paymentStatus" | "status" | "tracking" | "carrier">) {
  const store = await readStore();
  const order = store.orders.find((item) => item.id === id);
  if (!order) throw new Error("No se encontró el pedido.");
  const wasPaid = order.paymentStatus === "Pagado";
  Object.assign(order, changes);
  if (order.couponCode) {
    const coupon = store.coupons.find((item) => item.code === order.couponCode);
    if (coupon && order.paymentStatus === "Pagado") { coupon.used = true; delete coupon.reservedOrderId; }
    if (coupon && (order.status === "Cancelado" || order.paymentStatus === "Reembolsado")) { coupon.used = false; delete coupon.reservedOrderId; }
    const promotion = store.promotionCoupons.find((item) => item.code === order.couponCode);
    if (promotion && promotion.reservedOrderIds.includes(order.id) && order.paymentStatus === "Pagado" && order.status !== "Cancelado") {
      promotion.reservedOrderIds = promotion.reservedOrderIds.filter((value) => value !== order.id);
      promotion.uses += 1;
    }
    if (promotion && (order.status === "Cancelado" || order.paymentStatus === "Reembolsado")) {
      const wasReserved = promotion.reservedOrderIds.includes(order.id);
      promotion.reservedOrderIds = promotion.reservedOrderIds.filter((value) => value !== order.id);
      if (!wasReserved && wasPaid && promotion.uses > 0) promotion.uses -= 1;
    }
  }
  if (order.stockReserved && (order.status === "Cancelado" || order.paymentStatus === "Reembolsado")) {
    for (const item of order.items) {
      const book = store.books.find((entry) => entry.id === item.bookId);
      if (book) { book.stock += item.quantity; book.available = book.stock > 0; }
    }
    order.stockReserved = false;
  }
  if (order.paymentStatus === "Pagado" && order.status === "Entregado") {
    const email = order.email.toLowerCase();
    const fulfilled = store.orders.filter((item) => item.email.toLowerCase() === email && item.paymentStatus === "Pagado" && item.status === "Entregado").reduce((n, item) => n + item.items.reduce((a, product) => a + product.quantity, 0), 0);
    const target = Math.floor(fulfilled / 5);
    const current = store.coupons.filter((coupon) => coupon.email.toLowerCase() === email).length;
    for (let milestone = current + 1; milestone <= target; milestone++) {
      const code = `DIVAN10-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
      store.coupons.push({ id: randomUUID(), code, email, percent: 10, milestone, createdAt: new Date().toISOString(), used: false });
    }
  }
  await save(store);
  return order;
}

export async function addRestockRequest(input: Omit<RestockRequest, "id" | "createdAt">) {
  const store = await readStore();
  if (!store.books.some((book) => book.id === input.bookId)) throw new Error("No se encontró ese título.");
  const duplicate = store.restockRequests.some((item) => item.bookId === input.bookId && item.email.toLowerCase() === input.email.toLowerCase());
  if (!duplicate) store.restockRequests.unshift({ ...input, id: randomUUID(), createdAt: new Date().toISOString() });
  await save(store);
  return { duplicate };
}

export async function updateBookStock(id: string, quantity: number) {
  const store = await readStore();
  const book = store.books.find((item) => item.id === id);
  if (!book) throw new Error("No se encontró el libro.");
  book.stock = Math.max(0, Math.floor(quantity));
  book.available = book.stock > 0;
  await save(store);
  return book;
}

export async function createCustomerAccount(input: Omit<CustomerAccount, "id" | "createdAt">) {
  const store = await readStore();
  if (store.accounts.some((account) => account.email === input.email)) throw new Error("Ya existe una cuenta con ese correo.");
  const account = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
  store.accounts.push(account);
  await save(store);
  return account;
}

export async function getCustomerAccount(email: string) {
  const store = await readStore();
  const account = store.accounts.find((item) => item.email === email.toLowerCase());
  if (!account) return null;
  const customer = customerRows(store).find((item) => item.email === account.email);
  return { id: account.id, name: account.name, email: account.email, createdAt: account.createdAt, orders: customer?.orders || [], completedBooks: customer?.completedBooks || 0, earnedCoupons: store.coupons.filter((coupon) => coupon.email.toLowerCase() === account.email).length, nextRewardProgress: customer?.nextRewardProgress || 0, coupons: store.coupons.filter((coupon) => coupon.email.toLowerCase() === account.email) };
}

export async function getCustomerAuth(email: string) {
  const store = await readStore();
  return store.accounts.find((item) => item.email === email.toLowerCase()) || null;
}

export async function validateRewardCoupon(email: string, code: string) {
  const store = await readStore();
  const coupon = store.coupons.find((item) => item.code.toUpperCase() === code.trim().toUpperCase() && item.email.toLowerCase() === email.toLowerCase() && !item.used && !item.reservedOrderId);
  if (coupon) return { code: coupon.code, percent: coupon.percent, type: "reward" as const };
  const today = new Date().toISOString().slice(0, 10);
  const promotion = store.promotionCoupons.find((item) => item.code.toUpperCase() === code.trim().toUpperCase() && item.active && item.startsAt <= today && item.expiresAt >= today && item.uses + item.reservedOrderIds.length < item.usageLimit);
  return promotion ? { code: promotion.code, percent: promotion.percent, type: "promotion" as const } : null;
}

export async function createCheckoutOrder(input: { name: string; email: string; address: string; items: { bookId: string; quantity: number }[]; couponCode?: string }) {
  const store = await readStore();
  if (!input.items.length || input.items.length > 30) throw new Error("Tu carrito está vacío o es demasiado grande.");
  const quantities = new Map<string, number>();
  for (const line of input.items) quantities.set(line.bookId, (quantities.get(line.bookId) || 0) + line.quantity);
  const orderItems: AdminOrder["items"] = [];
  for (const [bookId, quantity] of quantities) {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error("La cantidad solicitada no es válida.");
    const book = store.books.find((item) => item.id === bookId);
    if (!book || book.stock < quantity) throw new Error(`No hay existencias suficientes de “${book?.title || "un libro"}”.`);
    orderItems.push({ bookId: book.id, title: book.title, quantity, unitPrice: book.price });
  }
  const subtotal = orderItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  let coupon: RewardCoupon | undefined;
  let promotion: PromotionCoupon | undefined;
  if (input.couponCode) {
    coupon = store.coupons.find((item) => item.code.toUpperCase() === input.couponCode?.trim().toUpperCase() && item.email.toLowerCase() === input.email.toLowerCase() && !item.used && !item.reservedOrderId);
    if (!coupon) {
      const today = new Date().toISOString().slice(0, 10);
      promotion = store.promotionCoupons.find((item) => item.code.toUpperCase() === input.couponCode?.trim().toUpperCase() && item.active && item.startsAt <= today && item.expiresAt >= today && item.uses + item.reservedOrderIds.length < item.usageLimit);
    }
    if (!coupon && !promotion) throw new Error("Ese cupón no existe, no está vigente, ya se usó o alcanzó su límite.");
  }
  const percent = coupon?.percent ?? promotion?.percent ?? 0;
  const discount = Math.round(subtotal * percent) / 100;
  const id = `ED-${Date.now().toString().slice(-8)}-${randomUUID().slice(0, 4).toUpperCase()}`;
  for (const line of orderItems) {
    const book = store.books.find((item) => item.id === line.bookId)!;
    book.stock -= line.quantity;
    book.available = book.stock > 0;
  }
  if (coupon) coupon.reservedOrderId = id;
  if (promotion) promotion.reservedOrderIds.push(id);
  const order: AdminOrder = { id, customer: input.name, email: input.email, date: new Date().toISOString().slice(0, 10), total: subtotal - discount, subtotal, discount, couponCode: coupon?.code ?? promotion?.code, couponType: coupon ? "reward" : promotion ? "promotion" : undefined, stockReserved: true, paymentStatus: "Pendiente", status: "Pendiente", tracking: "", carrier: "", address: input.address, items: orderItems };
  store.orders.unshift(order);
  for (const cart of store.carts) if (cart.email === input.email.toLowerCase() && cart.status === "abierto") cart.status = "convertido";
  await save(store);
  return order;
}

