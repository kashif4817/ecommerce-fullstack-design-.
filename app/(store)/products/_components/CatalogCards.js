"use client";

import Link from "next/link";
import { Heart, ImageOff, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const getThumb = (product) => product.image_url || product.images?.[0] || null;

const formatMoney = (value) => `$${Number(value ?? 0).toFixed(2)}`;

export function StarRating({ rating = 0, size = 12 }) {
  const filled = Math.round((rating ?? 0) / 2);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((index) => (
        <svg
          key={index}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={index <= filled ? "#FF9017" : "none"}
          stroke={index <= filled ? "#FF9017" : "#d4d4d8"}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function ProductBadge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-500",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function ProductGridCard({ product }) {
  const { addItem, isInCart } = useCart();
  const thumb = getThumb(product);
  const inCart = isInCart(product.id);
  const hasDiscount =
    product.original_price &&
    Number(product.original_price) > Number(product.base_price);
  const discountPct = hasDiscount
    ? Math.round(
        (1 - Number(product.base_price) / Number(product.original_price)) * 100
      )
    : 0;

  return (
    <article className="group overflow-hidden rounded-xl border border-[#DEE2E7] bg-white transition-all hover:border-slate-300 hover:shadow-sm">
      <div className="relative border-b border-[#EFF2F4] bg-white p-3">
        <button
          type="button"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#DEE2E7] bg-white text-slate-400 transition-colors hover:text-blue-500"
          aria-label="Save product"
        >
          <Heart size={15} />
        </button>

        <Link
          href={`/products/${product.id}`}
          className="flex h-[180px] items-center justify-center"
        >
          {thumb ? (
            <img
              src={thumb}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <ImageOff size={32} className="text-slate-300" />
          )}
        </Link>

        {hasDiscount && (
          <div className="absolute left-3 top-3">
            <ProductBadge tone="red">-{discountPct}%</ProductBadge>
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900">
              {formatMoney(product.base_price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                {formatMoney(product.original_price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <StarRating rating={product.rating} size={11} />
            <span>{product.rating ? product.rating.toFixed(1) : "0.0"}</span>
            <span>•</span>
            <span>{product.units_sold ?? 0} sold</span>
          </div>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="block line-clamp-2 text-sm font-medium leading-snug text-slate-800 transition-colors hover:text-blue-600"
        >
          {product.name}
        </Link>

        <div className="space-y-1 text-xs text-slate-500">
          <p className="line-clamp-1">
            {product.categories?.name || "General catalog"}
            {product.product_type ? ` • ${product.product_type}` : ""}
          </p>
          <p className="line-clamp-1">
            {product.material || "Ready to ship"}
            {product.stock !== null && product.stock !== undefined
              ? ` • ${product.stock} available`
              : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.is_in_stock ? (
            <ProductBadge tone="green">In stock</ProductBadge>
          ) : (
            <ProductBadge>Unavailable</ProductBadge>
          )}
          {product.is_deal && <ProductBadge tone="red">Deal</ProductBadge>}
          {product.is_featured && (
            <ProductBadge tone="amber">Featured</ProductBadge>
          )}
        </div>

        <button
          type="button"
          onClick={() => addItem(product)}
          disabled={!product.is_in_stock}
          className={`flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
            !product.is_in_stock
              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
              : inCart
              ? "border-blue-200 bg-blue-50 text-blue-600"
              : "border-blue-500 bg-white text-blue-600 hover:bg-blue-50"
          }`}
        >
          <ShoppingCart size={14} />
          {inCart ? "In cart" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

export function ProductListCard({ product }) {
  const { addItem, isInCart } = useCart();
  const thumb = getThumb(product);
  const inCart = isInCart(product.id);
  const hasDiscount =
    product.original_price &&
    Number(product.original_price) > Number(product.base_price);

  return (
    <article className="rounded-xl border border-[#DEE2E7] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row">
        <Link
          href={`/products/${product.id}`}
          className="flex h-[190px] w-full items-center justify-center rounded-xl border border-[#EFF2F4] bg-white p-4 md:h-[180px] md:w-[180px] md:shrink-0"
        >
          {thumb ? (
            <img
              src={thumb}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <ImageOff size={34} className="text-slate-300" />
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-2">
              <Link
                href={`/products/${product.id}`}
                className="block text-base font-semibold leading-snug text-slate-900 transition-colors hover:text-blue-600"
              >
                {product.name}
              </Link>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-xl font-bold text-slate-900">
                  {formatMoney(product.base_price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatMoney(product.original_price)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={product.rating} size={12} />
                  <span>{product.rating ? product.rating.toFixed(1) : "0.0"}</span>
                </div>
                <span>•</span>
                <span>{product.review_count ?? 0} reviews</span>
                <span>•</span>
                <span>{product.units_sold ?? 0} sold</span>
              </div>
            </div>

            <button
              type="button"
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#DEE2E7] text-slate-400 transition-colors hover:text-blue-500 lg:flex"
              aria-label="Save product"
            >
              <Heart size={16} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.is_in_stock ? (
              <ProductBadge tone="green">Ready to ship</ProductBadge>
            ) : (
              <ProductBadge>Out of stock</ProductBadge>
            )}
            {product.is_deal && <ProductBadge tone="red">Hot offer</ProductBadge>}
            {product.is_featured && (
              <ProductBadge tone="amber">Featured choice</ProductBadge>
            )}
            {product.is_recommended && (
              <ProductBadge tone="blue">Recommended</ProductBadge>
            )}
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-slate-500">
            {product.description ||
              `Browse ${product.categories?.name || "catalog"} products${
                product.product_type ? ` in ${product.product_type}` : ""
              }${product.material ? ` with ${product.material}` : ""}.`}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
            <span>
              Category:{" "}
              <Link
                href={`/products?category=${product.category_id}`}
                className="font-medium text-slate-700 hover:text-blue-600"
              >
                {product.categories?.name || "General"}
              </Link>
            </span>
            {product.product_type && <span>Type: {product.product_type}</span>}
            {product.material && <span>Material: {product.material}</span>}
            {product.stock !== null && product.stock !== undefined && (
              <span>Stock: {product.stock}</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => addItem(product)}
              disabled={!product.is_in_stock}
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                !product.is_in_stock
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  : inCart
                  ? "border-blue-200 bg-blue-50 text-blue-600"
                  : "border-blue-500 bg-white text-blue-600 hover:bg-blue-50"
              }`}
            >
              <ShoppingCart size={14} />
              {inCart ? "In cart" : "Add to cart"}
            </button>

            <Link
              href={`/products/${product.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProductsSkeleton({ viewMode = "grid" }) {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-[#DEE2E7] bg-white p-4 animate-pulse"
          >
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="h-[180px] w-full rounded-xl bg-slate-100 md:w-[180px]" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-2/3 rounded bg-slate-100" />
                <div className="h-6 w-40 rounded bg-slate-200" />
                <div className="h-3 w-1/2 rounded bg-slate-100" />
                <div className="h-20 w-full rounded bg-slate-50" />
                <div className="h-10 w-36 rounded-lg bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-[#DEE2E7] bg-white animate-pulse"
        >
          <div className="h-[210px] bg-slate-100" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-24 rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-3/4 rounded bg-slate-100" />
            <div className="h-10 w-full rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ hasFilter, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#DEE2E7] bg-white px-4 py-20 text-center text-slate-400">
      <ImageOff size={42} className="opacity-40" />
      <p className="text-base font-semibold text-slate-700">No products found</p>
      <p className="max-w-md text-sm text-slate-500">
        {hasFilter
          ? "Try changing your filters, search text, or price range."
          : "Products will appear here once they are added to your catalog."}
      </p>
      {hasFilter && (
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
