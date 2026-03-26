"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const getThumb = (product) =>
  product.image_url || product.images?.[0] || null;

/* ── fetch function — React Query needs a plain async fn ── */
async function fetchRecommended() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, base_price, image_url, images, category_id, categories(slug)")
    .eq("is_recommended", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="border border-[#DEE2E7] rounded-xl overflow-hidden bg-white animate-pulse">
      <div className="h-[220px] bg-gray-200" />
      <div className="px-3 pb-3 pt-2 border-t border-[#DEE2E7] space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
const RecommendedItems = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey:  ["recommended-products"],
    queryFn:   fetchRecommended,
    staleTime: 5  * 60 * 1000,
    gcTime:    30 * 60 * 1000,
  });

  /* ── Loading ── */
  if (isLoading) {
    return (
      <section className="w-full max-w-[1180px] mx-auto px-4 xl:px-0 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended items</h2>
        <div className="border border-[#DEE2E7] rounded-xl p-4">
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Empty ── */
  if (products.length === 0) {
    return (
      <section className="w-full max-w-[1180px] mx-auto px-4 xl:px-0 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended items</h2>
        <div className="border border-[#DEE2E7] rounded-xl p-4 flex items-center justify-center h-40 text-gray-400 text-sm">
          No recommended products yet.
        </div>
      </section>
    );
  }

  /* ── determine "View all" link ──────────────────────────────
     If all products share the same category → link to that browse page.
     Otherwise → link to a general /browse page.
  ── */
  const firstCatSlug = products[0]?.categories?.slug;
  const allSameCat   = products.every(p => p.categories?.slug === firstCatSlug);
  const viewAllHref  = allSameCat && firstCatSlug
    ? `/browse/${firstCatSlug}`
    : "/browse";

  return (
    <section className="w-full max-w-[1180px] mx-auto px-4 xl:px-0 py-6">

      {/* ── Header row ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Recommended items</h2>
        <Link
          href={viewAllHref}
          className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* ── Grid ── */}
      <div className="border border-[#DEE2E7] rounded-xl p-4 h-[636px] overflow-hidden">
        <div className="grid grid-cols-5 gap-3">
          {products.map((product) => {
            const thumb        = getThumb(product);
            const categorySlug = product.categories?.slug;

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group border border-[#DEE2E7] rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="bg-white flex items-center justify-center h-[220px] p-3">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart size={32} className="text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Price + Name */}
                <div className="px-3 pb-3 pt-2 border-t border-[#DEE2E7]">
                  <p className="font-bold text-gray-900 text-sm mb-1">
                    ${Number(product.base_price).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-snug">
                    {product.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── View all button below grid ── */}
      <div className="flex justify-center mt-4">
        <Link
          href={viewAllHref}
          className="border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-600 text-sm font-medium px-8 py-2.5 rounded-lg transition-colors"
        >
          View all recommended →
        </Link>
      </div>

    </section>
  );
};

export default RecommendedItems;