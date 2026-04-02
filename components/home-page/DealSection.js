"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ImageOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

async function fetchDealProducts() {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, base_price, original_price, image_url, images, deal_ends_at, categories(slug)"
    )
    .eq("is_deal", true)
    .or(`deal_ends_at.is.null,deal_ends_at.gte.${now}`)
    .order("units_sold", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

function discountPct(base, original) {
  if (!original || Number(original) <= Number(base)) {
    return null;
  }

  return `-${Math.round((1 - Number(base) / Number(original)) * 100)}%`;
}

const getThumb = (product) => product.image_url || product.images?.[0] || null;
const pad = (value) => String(value).padStart(2, "0");

export default function DealSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["deal-products"],
    queryFn: fetchDealProducts,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (!products.length) {
      return undefined;
    }

    const endDates = products
      .map((product) => product.deal_ends_at)
      .filter(Boolean)
      .map((date) => new Date(date));

    const target = endDates.length
      ? new Date(Math.min(...endDates))
      : new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

    const tick = () => {
      const diff = target - Date.now();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    tick();
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [products]);

  const tiles = isLoading
    ? Array.from({ length: 5 }, (_, index) => ({
        id: `ph-${index}`,
        _ghost: true,
      }))
    : products;

  return (
    <section className="w-full max-w-[1180px] mx-auto px-3 sm:px-4 lg:px-0">
      <div className="md:hidden rounded-xl border border-[#DEE2E7] bg-white overflow-hidden">
        <div className="border-b border-[#DEE2E7] px-3 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Deals and offers
              </h3>
              <p className="text-[11px] text-gray-400">
                Electronic equipments
              </p>
            </div>

            <div className="flex gap-1">
              {[
                { value: pad(timeLeft.days), label: "D" },
                { value: pad(timeLeft.hours), label: "H" },
                { value: pad(timeLeft.minutes), label: "M" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-w-[32px] rounded-md bg-[#606060] px-1.5 py-1 text-center text-white"
                >
                  <div className="text-[11px] font-bold leading-none">
                    {item.value}
                  </div>
                  <div className="mt-1 text-[8px] leading-none">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto px-3 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {tiles.map((product) => {
            if (product._ghost) {
              return (
                <div
                  key={product.id}
                  className="w-[108px] shrink-0 rounded-lg border border-[#DEE2E7] bg-white p-2 animate-pulse"
                >
                  <div className="h-[78px] rounded bg-gray-200" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-gray-200" />
                  <div className="mt-2 h-5 w-12 rounded-full bg-gray-100" />
                </div>
              );
            }

            const thumb = getThumb(product);
            const disc = discountPct(product.base_price, product.original_price);

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="w-[108px] shrink-0 rounded-lg border border-[#DEE2E7] bg-white p-2 transition-colors hover:bg-gray-50"
              >
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
                {disc ? (
                  <span className="mt-2 inline-flex rounded-full bg-[#FFE3E3] px-2 py-0.5 text-[10px] font-medium text-red-500">
                    {disc}
                  </span>
                ) : (
                  <span className="mt-2 inline-flex rounded-full bg-[#FFE3E3] px-2 py-0.5 text-[10px] font-medium text-red-500 opacity-0">
                    --
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="hidden md:flex border border-[#DEE2E7] bg-white flex-col md:flex-row overflow-x-auto">
        <div className="w-full md:w-[220px] md:shrink-0 border-b md:border-r md:border-b-0 border-[#DEE2E7] flex flex-col justify-center px-3 sm:px-5 py-3 md:py-4">
          <h3 className="text-sm md:text-base font-bold text-gray-900">
            Deals and offers
          </h3>
          <p className="text-xs text-gray-400 mb-2 md:mb-4">
            Hygiene equipments
          </p>

          <div className="flex gap-1 md:gap-2 flex-wrap">
            {[
              { value: pad(timeLeft.days), label: "Days" },
              { value: pad(timeLeft.hours), label: "Hour" },
              { value: pad(timeLeft.minutes), label: "Min" },
              { value: pad(timeLeft.seconds), label: "Sec" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#333] text-white rounded px-1.5 md:px-2.5 py-1 md:py-1.5 flex flex-col items-center min-w-[38px] md:min-w-[44px]"
              >
                <span className="text-xs md:text-base font-bold leading-tight">
                  {item.value}
                </span>
                <span className="text-[8px] md:text-[10px] leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-x divide-[#DEE2E7] min-h-[240px] md:h-[240px]">
          {tiles.map((product) => {
            if (product._ghost) {
              return (
                <div
                  key={product.id}
                  className="flex flex-col items-center justify-center gap-2 sm:gap-3 py-2 sm:py-4 px-2 sm:px-3 animate-pulse"
                >
                  <div className="w-[80px] sm:w-[100px] md:w-[120px] h-[80px] sm:h-[100px] md:h-[120px] bg-gray-200 rounded" />
                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-16" />
                  <div className="h-4 sm:h-5 bg-gray-100 rounded-full w-12" />
                </div>
              );
            }

            const thumb = getThumb(product);
            const disc = discountPct(product.base_price, product.original_price);

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex flex-col items-center justify-center gap-1 sm:gap-2 py-2 sm:py-4 px-2 sm:px-3 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-[80px] sm:w-[100px] md:w-[120px] h-[80px] sm:h-[100px] md:h-[120px] flex items-center justify-center shrink-0">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ImageOff size={24} className="sm:w-8 sm:h-8 text-gray-300" />
                  )}
                </div>

                <p className="text-xs sm:text-sm text-gray-700 text-center leading-tight line-clamp-1">
                  {product.name}
                </p>

                {disc ? (
                  <span className="bg-[#FFE3E3] text-red-500 text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 rounded-full">
                    {disc}
                  </span>
                ) : (
                  <span className="bg-[#FFE3E3] text-red-500 text-xs font-medium px-3 py-0.5 rounded-full opacity-0 pointer-events-none">
                    --
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
