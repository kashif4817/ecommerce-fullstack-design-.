"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ImageOff } from "lucide-react";
import { fetchProductsByParentSlug } from "@/lib/queries/categorySection";

const PARENT_SLUG = "electronics";
const BROWSE_HREF = `/browse/${PARENT_SLUG}`;
const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=280&h=257&fit=crop";

const getThumb = (product) => product.image_url || product.images?.[0] || null;
const PLACEHOLDERS = Array.from({ length: 8 }, (_, index) => ({
  id: `ph-${index}`,
}));

export default function ConsumerElectronicsSection() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["section-products", PARENT_SLUG],
    queryFn: () => fetchProductsByParentSlug(PARENT_SLUG, 8),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const tiles = isLoading
    ? PLACEHOLDERS
    : [...products, ...PLACEHOLDERS].slice(0, 8);

  return (
    <section className="w-full max-w-[1180px] mx-auto px-3 sm:px-4 lg:px-0">
      <div className="md:hidden rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="border-b border-gray-200 px-3 py-3">
          <h3 className="text-sm font-bold text-gray-900">
            Consumer electronics
          </h3>
        </div>

        <div className="flex gap-2 overflow-x-auto px-3 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {tiles.map((product) => {
            const thumb = getThumb(product);
            const isGhost = !!product.id?.startsWith("ph-") || isLoading;
            const price = product.base_price
              ? `From USD ${Number(product.base_price).toFixed(0)}`
              : "From USD 0";

            return (
              <Link
                key={product.id}
                href={isGhost ? "#" : `/products/${product.id}`}
                className={`w-[108px] shrink-0 rounded-lg border border-gray-200 p-2 ${
                  isGhost ? "pointer-events-none" : "hover:bg-gray-50"
                }`}
              >
                {isGhost ? (
                  <div className="animate-pulse">
                    <div className="h-[78px] rounded bg-gray-200" />
                    <div className="mt-2 h-3 w-3/4 rounded bg-gray-200" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                ) : (
                  <>
                    <div className="flex h-[78px] items-center justify-center">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <ImageOff size={22} className="text-gray-300" />
                      )}
                    </div>
                    <p className="mt-2 line-clamp-2 text-[11px] leading-tight text-gray-700">
                      {product.name}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-400">{price}</p>
                  </>
                )}
              </Link>
            );
          })}
        </div>

        <div className="px-3 pb-3">
          <Link
            href={BROWSE_HREF}
            className="text-[11px] font-medium text-blue-600"
          >
            Source now →
          </Link>
        </div>
      </div>

      <div className="hidden md:flex border border-gray-200 bg-white flex-col lg:flex-row overflow-x-auto">
        <div className="w-full lg:w-[270px] lg:h-[257px] h-[180px] sm:h-[220px] relative bg-[#EEF4F8] lg:shrink-0 flex flex-col justify-between p-3 sm:p-5">
          <img
            src={BANNER_IMAGE}
            alt="Consumer electronics"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-10">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
              Consumer electronics
              <br />
              and gadgets
            </h3>
          </div>
          <div className="relative z-10">
            <Link
              href={BROWSE_HREF}
              className="inline-block bg-white px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded hover:bg-gray-100 transition-colors border border-gray-200"
            >
              Source now
            </Link>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:grid-rows-2 border-l border-gray-200 min-h-[257px] lg:h-[257px]">
          {tiles.map((product, index) => {
            const thumb = getThumb(product);
            const isGhost = !!product.id?.startsWith("ph-") || isLoading;
            const price = product.base_price
              ? `USD ${Number(product.base_price).toFixed(0)}`
              : null;

            return (
              <Link
                key={product.id ?? index}
                href={isGhost ? "#" : `/products/${product.id}`}
                className={`
                  flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 transition-colors
                  ${index % 3 !== 2 && index < 3 ? "border-r border-gray-200" : ""}
                  ${index % 3 !== 2 && index >= 3 ? "border-r border-gray-200" : ""}
                  ${index < 3 ? "border-b border-gray-200" : ""}
                  ${isGhost ? "pointer-events-none" : "hover:bg-gray-50 cursor-pointer"}
                `}
              >
                {isGhost ? (
                  <div className="flex items-center justify-between w-full animate-pulse">
                    <div className="space-y-1 sm:space-y-1.5">
                      <div className="h-2 sm:h-3 w-16 sm:w-20 bg-gray-200 rounded" />
                      <div className="h-2 sm:h-2.5 w-8 sm:w-10 bg-gray-100 rounded" />
                      <div className="h-2 sm:h-2.5 w-12 sm:w-14 bg-gray-100 rounded" />
                    </div>
                    <div className="w-[50px] sm:w-[70px] h-[50px] sm:h-[70px] bg-gray-200 rounded shrink-0" />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-0.5 min-w-0 pr-1 sm:pr-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                        {product.name}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400">
                        From
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400">
                        {price}
                      </span>
                    </div>

                    <div className="w-[50px] sm:w-[70px] h-[50px] sm:h-[70px] shrink-0 flex items-center justify-center">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ImageOff
                          size={18}
                          className="sm:w-[22px] sm:h-[22px] text-gray-300"
                        />
                      )}
                    </div>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
