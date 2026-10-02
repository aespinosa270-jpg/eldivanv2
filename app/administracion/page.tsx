import { hasAdminSession } from "@/lib/admin-auth";
import { getAdminSnapshot } from "@/lib/admin-data";
import AdminDashboard from "@/components/admin-dashboard";
import AdminLogin from "@/components/admin-login";

export const dynamic = "force-dynamic";

export default async function AdministrationPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const signedIn = await hasAdminSession();
  const params = await searchParams;
  if (!signedIn) return <AdminLogin invalid={params.error === "1"} />;
  const snapshot = await getAdminSnapshot();
  return <AdminDashboard initialBooks={snapshot.books} initialOrders={snapshot.orders} initialCustomers={snapshot.customers} restockRequests={snapshot.restockRequests} initialCoupons={snapshot.coupons} promotionCoupons={snapshot.promotionCoupons} siteSettings={snapshot.siteSettings} posts={snapshot.posts} initialSubscribers={snapshot.subscribers} initialCampaigns={snapshot.campaigns} initialCarts={snapshot.carts} />;
}

