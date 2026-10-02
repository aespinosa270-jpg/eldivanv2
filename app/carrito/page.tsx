import Header from "@/components/header";
import Footer from "@/components/footer";
import CartPage from "@/components/cart-page";
import { getCatalogBooks } from "@/lib/admin-data";
import { getSignedInCustomer } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";
export default async function CartRoute() {
  const [books, customer] = await Promise.all([getCatalogBooks(), getSignedInCustomer()]);
  return <><Header/><main className="min-h-[70vh] bg-[#F7F3EC] py-8"><div className="page-shell"><CartPage books={books} customer={customer ? { name: customer.name, email: customer.email } : null}/></div></main><Footer/></>;
}
