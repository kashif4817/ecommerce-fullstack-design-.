"use client";

/* ─────────────────────────────────────────────────────────────
   app/browse/[categorySlug]/page.jsx
   "Source now" landing page — shows all products for a
   parent category and lets users filter by sub-category.
───────────────────────────────────────────────────────────── */

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ImageOff, Loader2, SlidersHorizontal,
  ChevronDown, Star, ShoppingCart,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import CategoryBar from "@/components/layout/CategoryBar";
import Footer from "@/components/layout/Footer";
import Newsletter from "@/components/layout/NewsLetter";
import {
  fetchProductsByParentSlug,
  fetchProductsByCategoryId,
  fetchCategoryWithChildren,
} from "@/lib/queries/categorySection";
import { useCart } from "@/context/CartContext";

/* ── helpers ── */
const getThumb = (p) => p.image_url || p.images?.[0] || null;

function StarRating({ rating = 0 }) {
  const filled = Math.round((rating ?? 0) / 2);
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="11" height="11" viewBox="0 0 24 24"
          fill={s <= filled ? "#FF9017" : "none"}
          stroke={s <= filled ? "#FF9017" : "#ccc"} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ product }) {
  const { addItem, isInCart } = useCart();
  const thumb    = getThumb(product);
  const hasDisc  = product.original_price && Number(product.original_price) > Number(product.base_price);
  const discPct  = hasDisc
    ? Math.round((1 - Number(product.base_price) / Number(product.original_price)) * 100)
    : 0;
  const inCart   = isInCart(product.id);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all group flex flex-col">

      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative h-44 bg-gray-50 overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={28} className="text-gray-200" />
          </div>
        )}
        {hasDisc && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            -{discPct}%
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <Link
          href={`/products/${product.id}`}
          className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          {product.review_count > 0 && (
            <span className="text-[10px] text-gray-400">({product.review_count})</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className="text-sm font-bold text-gray-900">
            ${Number(product.base_price).toFixed(2)}
          </span>
          {hasDisc && (
            <span className="text-xs text-gray-400 line-through">
              ${Number(product.original_price).toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={() => addItem(product)}
          className={`mt-1 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            inCart
              ? "bg-blue-50 text-blue-600 border border-blue-200"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <ShoppingCart size={13} />
          {inCart ? "In cart" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}

/* ── Product Grid Skeleton ── */
function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
          <div className="h-44 bg-gray-200" />
          <div className="p-3 space-y-2">
            <div className="h-3.5 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function BrowseCategoryPage() {
  const { categorySlug } = useParams();
  const [activeCatId, setActiveCatId] = useState(null); // null = all
  const [sortBy, setSortBy]           = useState("popular");

  /* ── fetch parent + children ── */
  const { data: categoryTree, isLoading: treeLoading } = useQuery({
    queryKey:  ["category-tree", categorySlug],
    queryFn:   () => fetchCategoryWithChildren(categorySlug),
    staleTime: 10 * 60 * 1000,
    gcTime:    60 * 60 * 1000,
  });

  /* ── fetch products — either all under parent or specific child ── */
  const { data: allProducts = [], isLoading: prodsLoading } = useQuery({
    queryKey:  ["browse-products", categorySlug],
    queryFn:   () => fetchProductsByParentSlug(categorySlug, 48),
    staleTime: 5  * 60 * 1000,
    gcTime:    30 * 60 * 1000,
    enabled:   !activeCatId,
  });

  const { data: filteredProducts = [], isLoading: filteredLoading } = useQuery({
    queryKey:  ["browse-products", "category", activeCatId],
    queryFn:   () => fetchProductsByCategoryId(activeCatId, 48),
    staleTime: 5  * 60 * 1000,
    gcTime:    30 * 60 * 1000,
    enabled:   !!activeCatId,
  });

  const rawProducts  = activeCatId ? filteredProducts : allProducts;
  const isLoadingProducts = activeCatId ? filteredLoading : prodsLoading;

  /* ── sort ── */
  const products = [...rawProducts].sort((a, b) => {
    if (sortBy === "popular")    return (b.units_sold ?? 0) - (a.units_sold ?? 0);
    if (sortBy === "price_asc")  return Number(a.base_price) - Number(b.base_price);
    if (sortBy === "price_desc") return Number(b.base_price) - Number(a.base_price);
    if (sortBy === "rating")     return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });

  const pageTitle = categoryTree?.name ?? categorySlug;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <CategoryBar />

      <main className="flex-1 py-6">
        <div className="max-w-[1180px] mx-auto px-4 space-y-5">

          {/* ── Breadcrumb ── */}
          <nav className="text-sm text-gray-500 flex items-center gap-1">
            <Link href="/" className="hover:text-blue-500">Home</Link>
            <span>›</span>
            <span className="text-blue-500 capitalize">{pageTitle}</span>
          </nav>

          {/* ── Page title ── */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 capitalize">{pageTitle}</h1>
              {!isLoadingProducts && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {products.length} product{products.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="h-9 pl-3 pr-8 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none appearance-none cursor-pointer focus:border-blue-400"
              >
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-5 items-start">

            {/* ── Sidebar: sub-categories ── */}
            <aside className="w-52 shrink-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Category
                </p>
              </div>
              <div className="py-2">
                {/* All */}
                <button
                  onClick={() => setActiveCatId(null)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    !activeCatId
                      ? "text-blue-600 font-semibold bg-blue-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All {pageTitle}
                </button>

                {treeLoading && (
                  <div className="px-4 py-3 space-y-2 animate-pulse">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-3 bg-gray-200 rounded w-3/4" />
                    ))}
                  </div>
                )}

                {categoryTree?.children?.map(child => (
                  <button
                    key={child.id}
                    onClick={() => setActiveCatId(child.id)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      activeCatId === child.id
                        ? "text-blue-600 font-semibold bg-blue-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {child.name}
                  </button>
                ))}
              </div>
            </aside>

            {/* ── Product Grid ── */}
            <div className="flex-1 min-w-0">
              {isLoadingProducts ? (
                <GridSkeleton />
              ) : products.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                  <ImageOff size={40} className="opacity-30" />
                  <p className="text-sm font-medium">No products found in this category</p>
                  <button
                    onClick={() => setActiveCatId(null)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View all →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}