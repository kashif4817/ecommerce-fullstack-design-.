// app/admin/dashboard/page.js
import { supabase } from '@/lib/supabase';
import AdminDashboardClient from '../_components/dashboard/AdminDashboardClient';
// import AdminDashboardClient from './_components/dashboard/AdminDashboardClient';

export const metadata = {
  title: 'Dashboard | Admin',
};

export const dynamic = 'force-dynamic';

const PIE_COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6', '#ec4899', '#14b8a6'];

function timeAgo(dateStr) {
  if (!dateStr) return 'N/A';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default async function AdminDashboardPage() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [
    { count: totalProducts = 0 },
    { count: totalCategories = 0 },
    { count: totalSuppliers = 0 },
    { count: totalOrders = 0 },
    { data: allOrders = [] },
    { data: ordersForChart = [] },
    { data: catProducts = [] },
    { data: recentOrdersRaw = [] },
    { data: recentProducts = [] },
    { data: topProducts = [] },
    { data: lowStockProducts = [] },
    { count: outOfStock = 0 },
    { count: verifiedSuppliers = 0 },
    { count: productsWithImages = 0 },
    { data: ratingRows = [] },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('suppliers').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total, created_at'),
    supabase
      .from('orders')
      .select('total, created_at')
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: true }),
    supabase.from('products').select('category_id, categories(name)'),
    supabase
      .from('orders')
      .select('id, status, total, created_at, customer_name')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('products')
      .select('id, name, slug, base_price, stock, rating, review_count, images')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('products')
      .select('id, name, base_price, rating, units_sold, images')
      .order('units_sold', { ascending: false })
      .limit(5),
    supabase
      .from('products')
      .select('id, name, stock, base_price')
      .gt('stock', 0)
      .lt('stock', 10)
      .order('stock', { ascending: true })
      .limit(5),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('stock', 0),
    supabase.from('suppliers').select('*', { count: 'exact', head: true }).eq('is_verified', true),
    supabase.from('products').select('id', { count: 'exact', head: true }).not('images', 'eq', '[]'),
    supabase.from('products').select('rating').gt('rating', 0),
  ]);

  const totalRevenue = (allOrders || []).reduce((sum, order) => sum + (order?.total ?? 0), 0);

  // Sales trend data
  const monthMap = {};
  for (const order of (ordersForChart || [])) {
    const key = new Date(order.created_at).toLocaleString('en-US', { month: 'short', year: '2-digit' });
    if (!monthMap[key]) monthMap[key] = { month: key, revenue: 0, orders: 0 };
    monthMap[key].revenue += order.total ?? 0;
    monthMap[key].orders += 1;
  }
  const salesData = Object.values(monthMap);

  // Category distribution
  const categoryCounts = {};
  for (const p of (catProducts || [])) {
    const name = p?.categories?.name ?? 'Uncategorized';
    categoryCounts[name] = (categoryCounts[name] ?? 0) + 1;
  }
  const categoryTotal = Object.values(categoryCounts).reduce((sum, v) => sum + v, 0) || 1;
  const categoryData = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count], index) => ({
      name,
      value: Math.round((count / categoryTotal) * 100),
      color: PIE_COLORS[index % PIE_COLORS.length],
    }));

  const recentOrders = (recentOrdersRaw || []).map((order) => ({
    ...order,
    shortId: (order.id || '').slice(0, 8).toUpperCase(),
    timeAgo: timeAgo(order.created_at),
  }));

  const avgRating = ratingRows?.length
    ? (ratingRows.reduce((sum, p) => sum + (p.rating ?? 0), 0) / ratingRows.length).toFixed(1)
    : 'N/A';

  const withImagesPct = totalProducts ? Math.round(((productsWithImages ?? 0) / totalProducts) * 100) : 0;

  return (
    <AdminDashboardClient
      totalProducts={totalProducts}
      totalCategories={totalCategories}
      totalSuppliers={totalSuppliers}
      totalOrders={totalOrders}
      totalRevenue={totalRevenue}
      salesData={salesData}
      categoryData={categoryData}
      recentOrders={recentOrders}
      recentProducts={recentProducts || []}
      topProducts={topProducts || []}
      lowStockProducts={lowStockProducts || []}
      outOfStock={outOfStock}
      verifiedSuppliers={verifiedSuppliers}
      avgRating={avgRating}
      withImagesPct={withImagesPct}
    />
  );
}