"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus, Search, Pencil, Trash2, Loader2, ImageOff,
  LayoutGrid, List, Tag, Package, FolderTree,
  Star, Sparkles, ShieldCheck, SlidersHorizontal,
  ChevronDown, X, TrendingUp,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import DeleteConfirmModal from "../../_components/DeleteConfirmModal";

/* ─────────────────────────────────────────────────────────── */

// Resolves display thumbnail: bucket upload → first external URL → null
const getThumb = (product) =>
  product.image_url || product.images?.[0] || null;

/* ─────────────────────────────────────────────────────────── */

export default function ProductCatalogPage() {
  /* ── data ── */
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  /* ── ui state ── */
  const [selectedCat,  setSelectedCat]  = useState("all");
  const [search,       setSearch]       = useState("");
  const [viewMode,     setViewMode]     = useState("grid");
  const [sortBy,       setSortBy]       = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");
  const [catSearch,    setCatSearch]    = useState("");

  /* ── delete ── */
  const [deleting,        setDeleting]        = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  /* ── fetch ── */
  useEffect(() => {
    let ok = true;
    const load = async () => {
      setLoading(true);
      const [{ data: prods, error: pErr }, { data: cats }] = await Promise.all([
        supabase
          .from("products")
          .select(`
            id, name, slug, base_price, original_price,
            is_in_stock, is_featured, is_deal, is_recommended,
            stock, images, image_url, category_id, created_at,
            units_sold, rating, review_count
          `)
          .order("created_at", { ascending: false }),
        supabase
          .from("categories")
          .select("id, name, image_url")
          .order("name"),
      ]);
      if (!ok) return;
      if (pErr) setError(pErr.message);
      else       setProducts(prods || []);
      setCategories(cats || []);
      setLoading(false);
    };
    load();
    return () => { ok = false; };
  }, []);

  /* ── delete handler ── */
  const handleDelete = async () => {
    if (!productToDelete) return;
    setDeleting(productToDelete.id);

    const { error: dbErr } = await supabase
      .from("products")
      .delete()
      .eq("id", productToDelete.id);

    if (!dbErr) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
    } else {
      setError(dbErr.message);
      setProductToDelete(null);
    }
    setDeleting(null);
  };

  /* ── derived counts per category ── */
  const countByCat = useMemo(() => {
    const map = { all: products.length };
    products.forEach(p => {
      if (p.category_id) map[p.category_id] = (map[p.category_id] ?? 0) + 1;
    });
    return map;
  }, [products]);

  /* ── filtered & sorted products ── */
  const visible = useMemo(() => {
    let list = [...products];

    if (selectedCat !== "all") list = list.filter(p => p.category_id === selectedCat);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }

    if (filterStatus === "active")       list = list.filter(p => p.is_in_stock);
    if (filterStatus === "out_of_stock") list = list.filter(p => !p.is_in_stock);
    if (filterStatus === "featured")     list = list.filter(p => p.is_featured);
    if (filterStatus === "deal")         list = list.filter(p => p.is_deal);

    if (sortBy === "newest")     list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === "oldest")     list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (sortBy === "price_asc")  list.sort((a, b) => a.base_price - b.base_price);
    if (sortBy === "price_desc") list.sort((a, b) => b.base_price - a.base_price);
    if (sortBy === "name")       list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [products, selectedCat, search, filterStatus, sortBy]);

  /* ── active category object ── */
  const activeCat = categories.find(c => c.id === selectedCat);

  /* ── filtered sidebar cats ── */
  const sidebarCats = useMemo(() =>
    categories.filter(c =>
      !catSearch.trim() || c.name.toLowerCase().includes(catSearch.toLowerCase())
    ), [categories, catSearch]);

  /* ═══════════════════════════════════════════════════════ */
  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Product Catalog</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Manage your products across all categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/categories/new"
            className="flex items-center gap-2 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <FolderTree size={15} />
            Add Category
          </Link>
          <Link
            href="/admin/products/catalog/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<Package size={18} className="text-blue-600" />}    bg="bg-blue-50"   value={products.length}                             label="Total Products" />
        <StatCard icon={<Tag size={18} className="text-purple-600" />}       bg="bg-purple-50" value={categories.length}                           label="Categories" />
        <StatCard icon={<ShieldCheck size={18} className="text-green-600"/>} bg="bg-green-50"  value={products.filter(p => p.is_in_stock).length}  label="In Stock" />
        <StatCard icon={<TrendingUp size={18} className="text-amber-600" />} bg="bg-amber-50"  value={products.filter(p => p.is_featured).length}  label="Featured" />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Main layout: sidebar + content ── */}
      <div className="flex gap-5 items-start">

        {/* ════ LEFT SIDEBAR ════ */}
        <aside className="w-56 shrink-0 bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">

          {/* Sidebar header + search */}
          <div className="px-3 pt-3 pb-2 border-b border-zinc-100">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1 mb-2">
              Categories
            </p>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={12} />
              <input
                type="text"
                value={catSearch}
                onChange={e => setCatSearch(e.target.value)}
                placeholder="Filter..."
                className="w-full h-7 pl-7 pr-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs placeholder-zinc-400 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* All products row */}
          <div className="px-2 pt-2">
            <button
              onClick={() => { setSelectedCat("all"); setCatSearch(""); }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-colors ${
                selectedCat === "all"
                  ? "bg-blue-600 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                <Package size={13} />
                All Products
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                selectedCat === "all" ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
              }`}>
                {countByCat.all ?? 0}
              </span>
            </button>
          </div>

          {/* Category list */}
          <div className="px-2 pb-3 mt-1 space-y-0.5 max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-6 text-zinc-400">
                <Loader2 size={16} className="animate-spin" />
              </div>
            ) : sidebarCats.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-4">No categories found</p>
            ) : (
              sidebarCats.map(cat => {
                const isActive = selectedCat === cat.id;
                const count    = countByCat[cat.id] ?? 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-colors group ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {cat.image_url ? (
                        <img src={cat.image_url} alt="" className="h-5 w-5 rounded object-cover shrink-0" />
                      ) : (
                        <Tag size={13} className="shrink-0" />
                      )}
                      <span className="truncate text-xs font-medium">{cat.name}</span>
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 font-medium ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : count === 0
                        ? "text-zinc-300"
                        : "bg-zinc-100 text-zinc-500"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Manage categories link */}
          <div className="px-3 py-2.5 border-t border-zinc-100">
            <Link
              href="/admin/categories"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-blue-600 transition-colors"
            >
              <FolderTree size={11} />
              Manage categories →
            </Link>
          </div>
        </aside>

        {/* ════ MAIN CONTENT ════ */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Category hero strip */}
          {selectedCat !== "all" && activeCat && (
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl border border-zinc-200 overflow-hidden bg-zinc-100 shrink-0 flex items-center justify-center">
                  {activeCat.image_url
                    ? <img src={activeCat.image_url} alt="" className="h-full w-full object-cover" />
                    : <Tag size={20} className="text-zinc-400" />
                  }
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">{activeCat.name}</h2>
                  <p className="text-sm text-zinc-500">
                    {countByCat[activeCat.id] ?? 0} product{(countByCat[activeCat.id] ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/catalog/new?category=${activeCat.id}`}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus size={15} />
                  Add Product
                </Link>
                <Link
                  href={`/admin/categories/${activeCat.id}/edit`}
                  className="flex items-center justify-center h-9 w-9 border border-zinc-200 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 transition-colors"
                >
                  <Pencil size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* Toolbar: search + filters + view toggle */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm px-4 py-3 flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full h-9 pl-8 pr-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm placeholder-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="h-9 pl-3 pr-8 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="featured">Featured</option>
                <option value="deal">Deal</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="h-9 pl-3 pr-8 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="name">Name A–Z</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>

            {/* Result count */}
            <span className="text-sm text-zinc-400 shrink-0">
              {visible.length} product{visible.length !== 1 ? "s" : ""}
            </span>

            {/* View toggle */}
            <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center justify-center h-9 w-9 transition-colors ${viewMode === "grid" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50"}`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center justify-center h-9 w-9 transition-colors ${viewMode === "list" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50"}`}
              >
                <List size={15} />
              </button>
            </div>
          </div>

          {/* ── Products grid / list ── */}
          {loading ? (
            <div className="bg-white rounded-xl border border-zinc-200 flex items-center justify-center py-24 text-zinc-400">
              <Loader2 size={24} className="animate-spin mr-2" />
              Loading products...
            </div>
          ) : visible.length === 0 ? (
            <div className="bg-white rounded-xl border border-zinc-200 flex flex-col items-center justify-center py-24 text-zinc-400">
              <Package size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">No products found</p>
              <p className="text-xs mt-1">
                {search || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : selectedCat !== "all"
                  ? "No products in this category yet"
                  : "Add your first product to get started"
                }
              </p>
              {selectedCat !== "all" && (
                <Link
                  href={`/admin/products/catalog/new?category=${selectedCat}`}
                  className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus size={14} />
                  Add first product
                </Link>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {visible.map(product => (
                <ProductGridCard
                  key={product.id}
                  product={product}
                  categories={categories}
                  onDelete={() => setProductToDelete(product)}
                  deleting={deleting === product.id}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Product</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Category</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Price</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Stock</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {visible.map(product => (
                    <ProductListRow
                      key={product.id}
                      product={product}
                      categories={categories}
                      onDelete={() => setProductToDelete(product)}
                      deleting={deleting === product.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete modal ── */}
      {productToDelete && (
        <DeleteConfirmModal
          item={productToDelete}
          title="Delete Product"
          description={
            <>
              Are you sure you want to delete <strong>{productToDelete.name}</strong>?
              This action cannot be undone.
            </>
          }
          confirmLabel="Delete Product"
          saving={deleting === productToDelete.id}
          onConfirm={handleDelete}
          onClose={() => { if (deleting !== productToDelete.id) setProductToDelete(null); }}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/* ── Sub-components ── */

function StatCard({ icon, bg, value, label }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-zinc-900">{value}</p>
        <p className="text-xs text-zinc-500">{label}</p>
      </div>
    </div>
  );
}

function ProductGridCard({ product, categories, onDelete, deleting }) {
  const cat     = categories.find(c => c.id === product.category_id);
  const thumb   = getThumb(product);
  const hasDisc = product.original_price && product.original_price > product.base_price;
  const discPct = hasDisc ? Math.round((1 - product.base_price / product.original_price) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden group hover:border-zinc-300 hover:shadow-md transition-all">
      {/* Image */}
      <div className="relative h-44 bg-zinc-100">
        {thumb ? (
          <img src={thumb} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <ImageOff size={24} className="text-zinc-300" />
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDisc && (
            <span className="text-xs font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">-{discPct}%</span>
          )}
          {product.is_featured && (
            <span className="text-xs font-medium bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Star size={9} /> Featured
            </span>
          )}
          {product.is_deal && (
            <span className="text-xs font-medium bg-purple-500 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Sparkles size={9} /> Deal
            </span>
          )}
        </div>

        {/* Image source indicator */}
        {thumb && (
          <div className="absolute bottom-2 right-2">
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
              product.image_url
                ? "bg-green-500/90 text-white"
                : "bg-zinc-700/70 text-zinc-200"
            }`}>
              {product.image_url ? "Uploaded" : "External"}
            </span>
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/admin/products/catalog/${product.id}/edit`}
            className="flex items-center justify-center h-7 w-7 bg-white border border-zinc-200 rounded-lg shadow-sm text-zinc-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
          >
            <Pencil size={12} />
          </Link>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="flex items-center justify-center h-7 w-7 bg-white border border-zinc-200 rounded-lg shadow-sm text-zinc-600 hover:text-red-600 hover:border-red-300 disabled:opacity-50 transition-colors"
          >
            {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-3.5 py-3 space-y-1.5">
        {cat && (
          <p className="text-xs text-blue-600 font-medium truncate">{cat.name}</p>
        )}
        <p className="text-sm font-semibold text-zinc-900 leading-snug line-clamp-2">{product.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-zinc-900">
            PKR {Number(product.base_price).toLocaleString()}
          </span>
          {hasDisc && (
            <span className="text-xs text-zinc-400 line-through">
              PKR {Number(product.original_price).toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <span className={`flex items-center gap-1 text-xs font-medium ${product.is_in_stock ? "text-green-600" : "text-red-500"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${product.is_in_stock ? "bg-green-500" : "bg-red-500"}`} />
            {product.is_in_stock ? "Active" : "Out of stock"}
          </span>
          {product.stock !== null && (
            <span className="text-xs text-zinc-400">Qty: {product.stock}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductListRow({ product, categories, onDelete, deleting }) {
  const cat     = categories.find(c => c.id === product.category_id);
  const thumb   = getThumb(product);
  const hasDisc = product.original_price && product.original_price > product.base_price;

  return (
    <tr className="hover:bg-zinc-50 transition-colors">
      {/* Product */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 rounded-lg border border-zinc-200 overflow-hidden bg-zinc-100 shrink-0 flex items-center justify-center">
            {thumb
              ? <img src={thumb} alt={product.name} className="h-full w-full object-cover" />
              : <ImageOff size={14} className="text-zinc-400" />
            }
            {/* Uploaded dot indicator */}
            {product.image_url && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-zinc-900 truncate max-w-[200px]">{product.name}</p>
            <p className="text-xs text-zinc-400 font-mono truncate max-w-[200px]">{product.slug}</p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-5 py-3.5 text-zinc-500 text-sm">
        {cat
          ? <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded font-medium">{cat.name}</span>
          : <span className="text-zinc-300 text-xs">—</span>
        }
      </td>

      {/* Price */}
      <td className="px-5 py-3.5">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-zinc-900">PKR {Number(product.base_price).toLocaleString()}</span>
          {hasDisc && (
            <span className="text-xs text-zinc-400 line-through">PKR {Number(product.original_price).toLocaleString()}</span>
          )}
        </div>
      </td>

      {/* Stock */}
      <td className="px-5 py-3.5 text-zinc-700 text-sm font-medium">
        {product.stock ?? 0}
      </td>

      {/* Status badges */}
      <td className="px-5 py-3.5">
        <div className="flex flex-wrap gap-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.is_in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {product.is_in_stock ? "Active" : "Out of stock"}
          </span>
          {product.is_featured && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Featured</span>
          )}
          {product.is_deal && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Deal</span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/products/catalog/${product.id}/edit`}
            className="flex items-center gap-1.5 text-xs text-blue-600 border border-blue-200 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Pencil size={12} />
            Edit
          </Link>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 text-xs text-red-500 border border-red-200 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}