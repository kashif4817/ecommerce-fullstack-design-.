"use client";

import Link from "next/link";
import { ImageOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const getThumb = (product) => product.image_url || product.images?.[0] || null;

async function fetchRecommended() {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, base_price, image_url, images, category_id, categories(slug)"
    )
    .eq("is_recommended", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

function ProductTile({ product, compact = false }) {
  const thumb = getThumb(product);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group rounded-xl border border-[#DEE2E7] bg-white p-2.5 transition-colors hover:bg-gray-50"
    >
      <div
        className={`flex items-center justify-center ${
          compact ? "h-[96px]" : "h-[140px]"
        }`}
      >
        {thumb ? (
          <img
            src={thumb}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <ImageOff size={24} className="text-gray-300" />
        )}
      </div>

      <p className="mt-2 line-clamp-2 text-[11px] sm:text-xs leading-tight text-gray-700">
        {product.name}
      </p>
      <p className="mt-1 text-[10px] sm:text-xs text-gray-400">
        From USD {Number(product.base_price ?? 0).toFixed(0)}
      </p>
    </Link>
  );
}

function SkeletonTile({ compact = false }) {
  return (
    <div className="rounded-xl border border-[#DEE2E7] bg-white p-2.5 animate-pulse">
      <div
        className={`rounded bg-gray-200 ${
          compact ? "h-[96px]" : "h-[140px]"
        }`}
      />
      <div className="mt-2 h-3 w-3/4 rounded bg-gray-200" />
      <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
    </div>
  );
}

export default function RecommendedItems() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["recommended-products"],
    queryFn: fetchRecommended,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const firstCatSlug = products[0]?.categories?.slug;
  const allSameCat = products.every(
    (product) => product.categories?.slug === firstCatSlug
  );
  const viewAllHref = allSameCat && firstCatSlug ? `/browse/${firstCatSlug}` : "/products";
  const mobileProducts = products.slice(0, 4);
  const desktopProducts = products.slice(0, 10);

  if (isLoading) {
    return (
      <section className="w-full max-w-[1180px] mx-auto px-3 sm:px-4 xl:px-0 py-4 sm:py-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
          Recommended items
        </h2>

        <div className="md:hidden border border-[#DEE2E7] rounded-xl p-3">
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonTile key={index} compact />
            ))}
          </div>
        </div>

        <div className="hidden md:block border border-[#DEE2E7] rounded-xl p-3 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {Array.from({ length: 10 }).map((_, index) => (
              <SkeletonTile key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="w-full max-w-[1180px] mx-auto px-3 sm:px-4 xl:px-0 py-4 sm:py-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
          Recommended items
        </h2>
        <div className="border border-[#DEE2E7] rounded-xl p-3 sm:p-4 flex items-center justify-center h-32 sm:h-40 text-gray-400 text-xs sm:text-sm">
          No recommended products yet.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1180px] mx-auto px-3 sm:px-4 xl:px-0 py-4 sm:py-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Recommended items
        </h2>
        <Link
          href={viewAllHref}
          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="md:hidden border border-[#DEE2E7] rounded-xl p-3 overflow-hidden">
        <div className="grid grid-cols-2 gap-2">
          {mobileProducts.map((product) => (
            <ProductTile key={product.id} product={product} compact />
          ))}
        </div>
      </div>

      <div className="hidden md:block border border-[#DEE2E7] rounded-xl p-3 sm:p-4 overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {desktopProducts.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
