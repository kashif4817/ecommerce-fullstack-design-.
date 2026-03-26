"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Tag,
  ShoppingCart,
  TrendingUp,
  Star,
  AlertTriangle,
  Clock,
  Image as ImageIcon,
  Plus,
  ImageOff,
} from "lucide-react";

export default function AdminDashboardClient({
  totalProducts = 0,
  totalCategories = 0,
  totalSuppliers = 0,
  totalOrders = 0,
  totalRevenue = 0,
  salesData = [],
  categoryData = [],
  recentOrders = [],
  recentProducts = [],
  topProducts = [],
  lowStockProducts = [],
  outOfStock = 0,
  verifiedSuppliers = 0,
  avgRating = 'N/A',
  withImagesPct = 0,
}) {
  const [activeTab, setActiveTab] = useState("recent");

  const revenueTrend = (salesData && salesData.length > 1)
    ? ((salesData[salesData.length - 1].revenue - salesData[0].revenue) / salesData[0].revenue) * 100
    : 0;

  // Smaller StatCard - Matching Product Catalog style
  const StatCard = ({ icon, bg, value, label, trend, isPositive }) => (
    <div className="bg-white rounded-xl border border-zinc-200 p-4 flex items-center gap-3 hover:shadow-sm transition-all">
      <div className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
        {trend && (
          <p className={`text-xs mt-1 flex items-center gap-1 ${isPositive !== undefined 
            ? (isPositive ? "text-emerald-600" : "text-red-600") 
            : "text-zinc-500"}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );

  // Mini Product Card for dashboard
  const MiniProductCard = ({ product }) => {
    if (!product) return null;
    const thumb = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null;

    return (
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden hover:border-zinc-300 transition-all group">
        <div className="relative h-36 bg-zinc-100">
          {thumb ? (
            <img 
              src={thumb} 
              alt={product.name || ''} 
              className="h-full w-full object-cover" 
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <ImageOff size={24} className="text-zinc-300" />
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold text-zinc-900 line-clamp-2 min-h-[40px]">
            {product.name || 'Unnamed Product'}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            PKR {Number(product.base_price || 0).toLocaleString()}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Overview of your store performance</p>
        </div>
        <Link
          href="/admin/products/catalog/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add New Product
        </Link>
      </div>

      {/* Main Stats - Smaller & Compact like Product Catalog */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<Package size={18} className="text-blue-600" />}
          bg="bg-blue-50"
          value={totalProducts}
          label="Total Products"
        />
        <StatCard
          icon={<ShoppingCart size={18} className="text-emerald-600" />}
          bg="bg-emerald-50"
          value={totalOrders}
          label="Total Orders"
        />
        <StatCard
          icon={<TrendingUp size={18} className="text-amber-600" />}
          bg="bg-amber-50"
          value={`PKR ${Math.round(totalRevenue / 1000)}k`}
          label="Total Revenue"
          trend={`${revenueTrend.toFixed(0)}%`}
          isPositive={revenueTrend >= 0}
        />
        <StatCard
          icon={<Tag size={18} className="text-purple-600" />}
          bg="bg-purple-50"
          value={totalCategories}
          label="Categories"
        />
      </div>

      {/* Secondary Stats - Even Smaller */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{outOfStock}</p>
            </div>
            <AlertTriangle size={22} className="text-red-500" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">Low Stock Items</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{lowStockProducts.length}</p>
            </div>
            <Clock size={22} className="text-amber-500" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">Avg. Rating</p>
              <p className="text-2xl font-bold text-zinc-900 mt-1 flex items-center gap-1">
                {avgRating} <Star size={16} className="text-amber-400 fill-current" />
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">With Images</p>
              <p className="text-2xl font-bold text-zinc-900 mt-1">{withImagesPct}%</p>
            </div>
            <ImageIcon size={22} className="text-zinc-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Revenue Trend (Last 6 Months)</h2>
            <div className="text-xs text-zinc-500">PKR</div>
          </div>
          <div className="h-52 flex items-center justify-center border border-dashed border-zinc-200 rounded-xl text-zinc-400 bg-zinc-50 text-sm">
            Sales Trend Chart (Add Recharts later)<br />
            {salesData.length} months loaded
          </div>
        </div>

        {/* Category Distribution */}
        <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-5">
          <h2 className="font-semibold text-lg mb-4">Category Distribution</h2>
          <div className="space-y-3 text-sm">
            {Array.isArray(categoryData) && categoryData.length > 0 ? (
              categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div 
                    className="h-2.5 w-2.5 rounded-full shrink-0" 
                    style={{ backgroundColor: cat?.color || '#64748b' }} 
                  />
                  <div className="flex-1 truncate">{cat?.name || 'Unknown'}</div>
                  <div className="font-medium text-zinc-600">{cat?.value || 0}%</div>
                </div>
              ))
            ) : (
              <p className="text-zinc-400 text-sm py-4">No category data available</p>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="lg:col-span-12 bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <div className="border-b border-zinc-100 px-5 py-4 flex items-center gap-6">
            <button
              onClick={() => setActiveTab("recent")}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "recent" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Recently Added
            </button>
            <button
              onClick={() => setActiveTab("top")}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "top" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Best Sellers
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 p-5">
            {(activeTab === "recent" ? recentProducts : topProducts)
              .slice(0, 5)
              .map((product) => (
                <MiniProductCard key={product?.id} product={product} />
              ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-12 bg-white border border-zinc-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Orders</h2>
            <Link href="/admin/orders" className="text-blue-600 hover:underline text-sm">
              View all orders →
            </Link>
          </div>

          <div className="space-y-3">
            {Array.isArray(recentOrders) && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart size={16} className="text-zinc-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Order #{order.shortId}</p>
                      <p className="text-xs text-zinc-500">{order.customer_name || 'Customer'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">PKR {Number(order.total || 0).toLocaleString()}</p>
                    <p className="text-xs text-zinc-500">{order.timeAgo}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-400 py-8 text-center">No recent orders found</p>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {Array.isArray(lowStockProducts) && lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-amber-600" size={18} />
            <h3 className="font-semibold text-amber-800">Low Stock Alert</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-lg border border-amber-100 p-3 text-sm">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-amber-600 text-xs mt-1">Only {p.stock} left</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}