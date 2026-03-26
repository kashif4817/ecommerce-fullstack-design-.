"use client";

/* ─────────────────────────────────────────────────────────────
   HomeOutdoorSection.jsx
   – Real data from Supabase via React Query
   – Exact UI match to Figma
   – "Source now" navigates to /browse/home-living
───────────────────────────────────────────────────────────── */

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ImageOff } from "lucide-react";
// import { fetchProductsByParentSlug } from "@/lib/queries/categorySection";
import { fetchProductsByParentSlug } from "@/lib/queries/categorySection";


const PARENT_SLUG  = "home-living";
const BROWSE_HREF  = `/browse/${PARENT_SLUG}`;
const BANNER_IMAGE = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=280&h=257&fit=crop";

const getThumb = (p) => p.image_url || p.images?.[0] || null;
const PLACEHOLDERS = Array.from({ length: 8 }, (_, i) => ({ id: `ph-${i}` }));

/* ════════════════════════════════════════════════════════════ */
export default function HomeOutdoorSection() {
  const { data: products = [], isLoading } = useQuery({
    queryKey:  ["section-products", PARENT_SLUG],
    queryFn:   () => fetchProductsByParentSlug(PARENT_SLUG, 8),
    staleTime: 5  * 60 * 1000,
    gcTime:    30 * 60 * 1000,
  });

  const tiles = isLoading
    ? PLACEHOLDERS
    : [...products, ...PLACEHOLDERS].slice(0, 8);

  return (
    <section className="w-full max-w-[1180px] mx-auto border border-gray-200 bg-white flex overflow-hidden">

      {/* ── Left Banner ── */}
      <div className="w-[270px] h-[257px] relative bg-[#F5F0E8] shrink-0 flex flex-col justify-between p-5">
        <img
          src={BANNER_IMAGE}
          alt="Home and outdoor"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-10">
          <h3 className="text-base font-bold text-gray-900 leading-snug">
            Home and outdoor
          </h3>
        </div>
        <div className="relative z-10">
          <Link
            href={BROWSE_HREF}
            className="inline-block bg-white px-4 py-1.5 text-sm font-medium rounded hover:bg-gray-100 transition-colors border border-gray-200"
          >
            Source now
          </Link>
        </div>
      </div>

      {/* ── Right Products Grid — 4 cols × 2 rows ── */}
      <div className="flex-1 grid grid-cols-4 grid-rows-2 border-l border-gray-200 h-[257px]">
        {tiles.map((product, index) => {
          const thumb   = getThumb(product);
          const isGhost = !!product.id?.startsWith("ph-") || isLoading;
          const price   = product.base_price
            ? `USD ${Number(product.base_price).toFixed(0)}`
            : null;

          return (
            <Link
              key={product.id ?? index}
              href={isGhost ? "#" : `/products/${product.id}`}
              className={`
                flex items-center justify-between px-4 py-3 transition-colors
                ${index % 4 !== 3 ? "border-r border-gray-200" : ""}
                ${index < 4      ? "border-b border-gray-200" : ""}
                ${isGhost        ? "pointer-events-none" : "hover:bg-gray-50 cursor-pointer"}
              `}
            >
              {isGhost ? (
                <div className="flex items-center justify-between w-full animate-pulse">
                  <div className="space-y-1.5">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-2.5 w-10 bg-gray-100 rounded" />
                    <div className="h-2.5 w-14 bg-gray-100 rounded" />
                  </div>
                  <div className="w-[70px] h-[70px] bg-gray-200 rounded shrink-0" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {product.name}
                    </span>
                    <span className="text-xs text-gray-400">From</span>
                    <span className="text-xs text-gray-400">{price}</span>
                  </div>
                  <div className="w-[70px] h-[70px] shrink-0 flex items-center justify-center">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ImageOff size={22} className="text-gray-300" />
                    )}
                  </div>
                </>
              )}
            </Link>
          );
        })}
      </div>

    </section>
  );
}