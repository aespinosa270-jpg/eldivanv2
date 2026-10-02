import Header from "@/components/header";
import Footer from "@/components/footer";
import CustomerAccountPanel from "@/components/customer-account-panel";
import { getCustomerAccount } from "@/lib/admin-data";
import { getSignedInCustomer } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export default async function CustomerAccountPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [session, params] = await Promise.all([getSignedInCustomer(), searchParams]);
  const account = session ? await getCustomerAccount(session.email) : null;
  return <><Header/><main className="min-h-[70vh] bg-[#F7F3EC] py-9"><div className="page-shell"><CustomerAccountPanel account={account ? { name: account.name, email: account.email, orders: account.orders, completedBooks: account.completedBooks, nextRewardProgress: account.nextRewardProgress, coupons: account.coupons } : null} error={params.error}/></div></main><Footer/></>;
}
