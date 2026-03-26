'use client'

import { useState, useTransition, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Package, Search, Plus, Filter, Star, ChevronLeft, ChevronRight,
  CheckCircle, AlertTriangle, XCircle, Sparkles, Edit2, Trash2,
  ArrowUpDown, Eye, MoreHorizontal, X,
} from 'lucide-react'

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0)

// ── stock badge ───────────────────────────────────────────────────────────────
function StockBadge({ stock }) {
  if (stock === 0)   return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600"><XCircle size={9}/> Out</span>
  if (stock < 10)    return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700"><AlertTriangle size={9}/> Low ({stock})</span>
  return               <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"><CheckCircle size={9}/> {stock}</span>
}

// ── stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, iconCls, bgCls, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all w-full
        ${active
          ? 'border-indigo-300 bg-indigo-50 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
        }`}
    >
      <div className={`rounded-lg p-1.5 ${bgCls} flex-shrink-0`}>
        <Icon size={15} className={iconCls} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-base font-bold text-slate-800 leading-tight">{(value ?? 0).toLocaleString()}</p>
      </div>
    </button>
  )
}

// ── main component ────────────────────────────────────────────────────────────
export default function ProductsClient({
  products,
  categories,
  suppliers,
  totalCount,
  currentPage,
  pageSize,
  stats,
}) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search,   setSearch]   = useState(searchParams.get('search')   || '')
  const [catFilter, setCatFilter] = useState(searchParams.get('category') || '')
  const [stockFilter, setStockFilter] = useState(searchParams.get('stock') || '')

  const totalPages = Math.ceil(totalCount / pageSize)

  // ── navigate helper ──────────────────────────────────────────────────────
  const navigate = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    // reset page on filter change
    if (!('page' in updates)) params.set('page', '1')
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }, [searchParams, pathname, router])

  // ── search submit ────────────────────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault()
    navigate({ search, page: '1' })
  }

  // ── category filter ──────────────────────────────────────────────────────
  const handleCategory = (val) => {
    setCatFilter(val)
    navigate({ category: val })
  }

  // ── stock filter via stat card click ────────────────────────────────────
  const handleStockFilter = (val) => {
    const next = stockFilter === val ? '' : val
    setStockFilter(next)
    navigate({ stock: next })
  }

  // ── page nav ─────────────────────────────────────────────────────────────
  const goPage = (p) => navigate({ page: String(p) })

  // ── clear all filters ────────────────────────────────────────────────────
  const clearAll = () => {
    setSearch(''); setCatFilter(''); setStockFilter('')
    startTransition(() => router.push(pathname))
  }

  const hasFilters = search || catFilter || stockFilter

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-[1600px] px-4 md:px-6 h-11 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Package size={14} className="text-indigo-500 flex-shrink-0" />
            <h1 className="text-sm font-bold text-slate-900 truncate">Products</h1>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
              {(stats?.totalAll ?? 0).toLocaleString()}
            </span>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-700 transition flex-shrink-0"
          >
            <Plus size={10} /> New Product
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 md:px-6 pt-4 pb-8 space-y-4">

        {/* ── Stat cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard
            label="All Products" value={stats?.totalAll}
            icon={Package} iconCls="text-indigo-500" bgCls="bg-indigo-50"
            active={!stockFilter} onClick={() => handleStockFilter('')}
          />
          <StatCard
            label="In Stock" value={stats?.inStock}
            icon={CheckCircle} iconCls="text-emerald-500" bgCls="bg-emerald-50"
            active={stockFilter === 'in'} onClick={() => handleStockFilter('in')}
          />
          <StatCard
            label="Low Stock" value={stats?.lowStock}
            icon={AlertTriangle} iconCls="text-amber-500" bgCls="bg-amber-50"
            active={stockFilter === 'low'} onClick={() => handleStockFilter('low')}
          />
          <StatCard
            label="Out of Stock" value={stats?.outOfStock}
            icon={XCircle} iconCls="text-red-400" bgCls="bg-red-50"
            active={stockFilter === 'out'} onClick={() => handleStockFilter('out')}
          />
          <StatCard
            label="Featured" value={stats?.featured}
            icon={Sparkles} iconCls="text-violet-500" bgCls="bg-violet-50"
            active={false} onClick={() => {}}
          />
        </div>

        {/* ── Search + filter bar ──────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2">
          {/* search */}
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300 transition"
            />
          </form>

          {/* category filter */}
          <div className="relative">
            <Filter size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={catFilter}
              onChange={(e) => handleCategory(e.target.value)}
              className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-7 pr-6 text-xs text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300 transition cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* clear filters */}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 hover:border-red-200 hover:text-red-500 transition"
            >
              <X size={11} /> Clear
            </button>
          )}

          <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
            {isPending && <span className="animate-pulse text-indigo-500">Loading…</span>}
            <span>
              {Math.min((currentPage - 1) * pageSize + 1, totalCount)}–{Math.min(currentPage * pageSize, totalCount)} of {totalCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ── Table ────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wide text-slate-400">
                    <th className="px-4 py-2.5 text-left font-medium w-8">#</th>
                    <th className="px-4 py-2.5 text-left font-medium">Product</th>
                    <th className="px-4 py-2.5 text-left font-medium">Category</th>
                    <th className="px-4 py-2.5 text-left font-medium">Supplier</th>
                    <th className="px-4 py-2.5 text-right font-medium">Price</th>
                    <th className="px-4 py-2.5 text-center font-medium">Stock</th>
                    <th className="px-4 py-2.5 text-center font-medium">Rating</th>
                    <th className="px-4 py-2.5 text-center font-medium">Sold</th>
                    <th className="px-4 py-2.5 text-center font-medium">Flags</th>
                    <th className="px-4 py-2.5 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((product, idx) => {
                    const img = product.product_images
                      ?.sort((a, b) => a.sort_order - b.sort_order)
                      ?.find((i) => i.is_primary)?.image_url
                      ?? product.product_images?.[0]?.image_url

                    const rowNum = (currentPage - 1) * pageSize + idx + 1

                    return (
                      <tr key={product.id} className="group hover:bg-indigo-50/30 transition-colors">

                        {/* row number */}
                        <td className="px-4 py-2.5 text-slate-300 font-mono">{rowNum}</td>

                        {/* product name + image */}
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5 min-w-[180px]">
                            <div className="relative h-9 w-9 flex-shrink-0 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center text-slate-400">
                              {img
                                ? <Image src={img} alt={product.name} fill className="object-cover" />
                                : <Package size={14} />
                              }
                            </div>
                            <div className="min-w-0">
                              <p className="line-clamp-1 font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                {product.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                                {product.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* category */}
                        <td className="px-4 py-2.5">
                          {product.categories ? (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                              {product.categories.name}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* supplier */}
                        <td className="px-4 py-2.5">
                          {product.suppliers ? (
                            <div className="flex items-center gap-1">
                              <span className="text-slate-600 truncate max-w-[100px]">{product.suppliers.name}</span>
                              {product.suppliers.is_verified && (
                                <CheckCircle size={10} className="text-emerald-500 flex-shrink-0" />
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* price */}
                        <td className="px-4 py-2.5 text-right">
                          <span className="font-semibold text-slate-900">{fmt(product.base_price)}</span>
                          {product.original_price && product.original_price > product.base_price && (
                            <p className="text-[10px] text-slate-400 line-through">{fmt(product.original_price)}</p>
                          )}
                        </td>

                        {/* stock */}
                        <td className="px-4 py-2.5 text-center">
                          <StockBadge stock={product.stock} />
                        </td>

                        {/* rating */}
                        <td className="px-4 py-2.5 text-center">
                          {product.rating > 0 ? (
                            <div className="flex items-center justify-center gap-0.5 text-amber-400 font-semibold">
                              <Star size={10} fill="currentColor" />
                              <span>{product.rating}</span>
                              <span className="text-slate-300 font-normal">({product.review_count ?? 0})</span>
                            </div>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* units sold */}
                        <td className="px-4 py-2.5 text-center font-medium text-slate-600">
                          {(product.units_sold ?? 0).toLocaleString()}
                        </td>

                        {/* flags */}
                        <td className="px-4 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {product.is_featured && (
                              <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold text-violet-600">FEAT</span>
                            )}
                            {product.is_deal && (
                              <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-600">DEAL</span>
                            )}
                            {product.is_recommended && (
                              <span className="rounded-full bg-cyan-100 px-1.5 py-0.5 text-[9px] font-bold text-cyan-600">REC</span>
                            )}
                            {!product.is_featured && !product.is_deal && !product.is_recommended && (
                              <span className="text-slate-300">—</span>
                            )}
                          </div>
                        </td>

                        {/* actions */}
                        <td className="px-4 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                              title="View"
                            >
                              <Eye size={13} />
                            </Link>
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="rounded-md p-1.5 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 transition"
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </Link>
                            <button
                              className="rounded-md p-1.5 text-slate-400 hover:bg-red-100 hover:text-red-500 transition"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Package size={32} className="mb-3 text-slate-300" />
              <p className="text-sm font-medium">No products found</p>
              {hasFilters && (
                <button onClick={clearAll} className="mt-2 text-xs text-indigo-500 hover:text-indigo-700 transition">
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Pagination ───────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Page <span className="font-semibold text-slate-700">{currentPage}</span> of{' '}
              <span className="font-semibold text-slate-700">{totalPages}</span>
              {' '}· {totalCount.toLocaleString()} total
            </p>

            <div className="flex items-center gap-1">
              {/* prev */}
              <button
                onClick={() => goPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={12} /> Prev
              </button>

              {/* page numbers */}
              <div className="flex items-center gap-1">
                {buildPageNums(currentPage, totalPages).map((p, i) =>
                  p === '…' ? (
                    <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-slate-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goPage(p)}
                      className={`min-w-[28px] rounded-lg border px-2 py-1.5 text-xs font-medium transition
                        ${p === currentPage
                          ? 'border-indigo-400 bg-indigo-600 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                        }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              {/* next */}
              <button
                onClick={() => goPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── pagination helper: 1 … 4 5 6 … 12 ────────────────────────────────────────
function buildPageNums(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  const add = (n) => pages.push(n)
  add(1)
  if (current > 3)          add('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) add(p)
  if (current < total - 2)  add('…')
  add(total)
  return pages
}