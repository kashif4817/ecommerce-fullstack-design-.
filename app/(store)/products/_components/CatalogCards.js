"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Star, Truck, BadgeCheck } from "lucide-react";

/* ─── Stars helper ─────────────────────────────────── */
function StarRow({ rating, reviewCount }) {
  const full = Math.floor(Number(rating ?? 0) / 2);
  const half = (Number(rating ?? 0) / 2) % 1 >= 0.5;
  return (
    <span className="flex items-center gap-1">
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={12}
            className={
              s <= full
                ? "fill-amber-400 text-amber-400"
                : s === full + 1 && half
                ? "fill-amber-200 text-amber-400"
                : "fill-slate-200 text-slate-200"
            }
          />
        ))}
      </span>
      {reviewCount > 0 && (
        <span className="text-xs text-slate-400">{reviewCount}</span>
      )}
    </span>
  );
}

/* ─── Badges ────────────────────────────────────────── */
function Badges({ product }) {
  return (
    <div className="flex flex-wrap gap-1">
      {product.is_featured && (
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
          Featured
        </span>
      )}
      {product.is_deal && (
        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
          Deal
        </span>
      )}
      {product.is_recommended && (
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
          Recommended
        </span>
      )}
      {!product.is_in_stock && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
          Out of stock
        </span>
      )}
    </div>
  );
}

/* ─── Grid Card ─────────────────────────────────────── */
export function ProductGridCard({ product }) {
  const discount =
    product.original_price && Number(product.original_price) > Number(product.base_price)
      ? Math.round(
          ((Number(product.original_price) - Number(product.base_price)) /
            Number(product.original_price)) *
            100
        )
      : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#DEE2E7] bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="8" fill="#EFF2F4" />
              <path d="M14 34l8-10 6 7 4-5 6 8H14z" fill="#CBD5E1" />
              <circle cx="32" cy="18" r="4" fill="#CBD5E1" />
            </svg>
          </div>
        )}

        {/* Discount badge */}
        {discount && (
          <span className="absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-[#DEE2E7] bg-white text-slate-400 opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:text-rose-500"
          aria-label="Add to wishlist"
        >
          <Heart size={13} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Badges product={product} />

        {product.categories?.name && (
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            {product.categories.name}
          </span>
        )}

        <p className="line-clamp-2 text-sm font-medium leading-snug text-slate-800">
          {product.name}
        </p>

        <StarRow rating={product.rating} reviewCount={product.review_count} />

        {product.units_sold > 0 && (
          <span className="text-[11px] text-slate-400">
            {product.units_sold.toLocaleString()} sold
          </span>
        )}

        {/* Price row */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <span className="text-base font-bold text-slate-900">
              ${Number(product.base_price).toFixed(2)}
            </span>
            {product.original_price &&
              Number(product.original_price) > Number(product.base_price) && (
                <span className="ml-1.5 text-xs text-slate-400 line-through">
                  ${Number(product.original_price).toFixed(2)}
                </span>
              )}
          </div>

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700"
            aria-label="Add to cart"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ─── List Card ─────────────────────────────────────── */
export function ProductListCard({ product }) {
  const discount =
    product.original_price && Number(product.original_price) > Number(product.base_price)
      ? Math.round(
          ((Number(product.original_price) - Number(product.base_price)) /
            Number(product.original_price)) *
            100
        )
      : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex overflow-hidden rounded-2xl border border-[#DEE2E7] bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative w-36 flex-shrink-0 overflow-hidden bg-slate-50 sm:w-44">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="8" fill="#EFF2F4" />
              <path d="M14 34l8-10 6 7 4-5 6 8H14z" fill="#CBD5E1" />
              <circle cx="32" cy="18" r="4" fill="#CBD5E1" />
            </svg>
          </div>
        )}
        {discount && (
          <span className="absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            {product.categories?.name && (
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                {product.categories.name}
              </span>
            )}
            <p className="line-clamp-1 text-sm font-semibold text-slate-800 sm:line-clamp-2 sm:text-base">
              {product.name}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="mt-0.5 flex-shrink-0 text-slate-300 transition-colors hover:text-rose-500"
            aria-label="Add to wishlist"
          >
            <Heart size={16} />
          </button>
        </div>

        <StarRow rating={product.rating} reviewCount={product.review_count} />

        {product.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
            {product.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-slate-400">
          {product.is_in_stock && (
            <span className="flex items-center gap-1 text-emerald-600">
              <Truck size={11} />
              Free Shipping
            </span>
          )}
          {product.units_sold > 0 && (
            <span>{product.units_sold.toLocaleString()} orders</span>
          )}
        </div>

        <Badges product={product} />

        {/* Price row */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-slate-900">
              ${Number(product.base_price).toFixed(2)}
            </span>
            {product.original_price &&
              Number(product.original_price) > Number(product.base_price) && (
                <span className="text-xs text-slate-400 line-through">
                  ${Number(product.original_price).toFixed(2)}
                </span>
              )}
          </div>

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <ShoppingCart size={13} />
            <span className="hidden sm:inline">Add to cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ─── Empty State ───────────────────────────────────── */
export function EmptyState({ hasFilter, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#DEE2E7] bg-white py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#94A3B8" strokeWidth="1.5" />
          <path d="M18 18l6 6" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">No products found</p>
        <p className="mt-1 text-xs text-slate-500">
          {hasFilter
            ? "Try adjusting your filters or search query."
            : "There are no products in the catalog yet."}
        </p>
      </div>
      {hasFilter && (
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

/* ─── Skeleton ──────────────────────────────────────── */
export function ProductsSkeleton({ viewMode = "grid" }) {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex h-36 overflow-hidden rounded-2xl border border-[#DEE2E7] bg-white">
            <div className="w-36 animate-pulse bg-slate-100 sm:w-44" />
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
              <div className="mt-auto h-6 w-20 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-[#DEE2E7] bg-white">
          <div className="aspect-square animate-pulse bg-slate-100" />
          <div className="flex flex-col gap-2 p-3">
            <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            <div className="mt-1 h-5 w-20 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}