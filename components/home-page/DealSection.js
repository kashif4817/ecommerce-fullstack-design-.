"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ImageOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

/* ── fetch deal products ── */
async function fetchDealProducts() {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, base_price, original_price, image_url, images, deal_ends_at, categories(slug)")
    .eq("is_deal", true)
    .or(`deal_ends_at.is.null,deal_ends_at.gte.${now}`)   // not expired
    .order("units_sold", { ascending: false })
    .limit(5);

  if (error) throw new Error(error.message);
  return data || [];
}

/* ── compute discount % ── */
function discountPct(base, original) {
  if (!original || Number(original) <= Number(base)) return null;
  return `-${Math.round((1 - Number(base) / Number(original)) * 100)}%`;
}

/* ── thumb helper ── */
const getThumb = (p) => p.image_url || p.images?.[0] || null;

/* ── pad numbers ── */
const pad = (n) => String(n).padStart(2, "0");

/* ════════════════════════════════════════════════════════════ */
const DealSection = () => {

  /* ── countdown — driven by the earliest deal_ends_at ── */
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const { data: products = [], isLoading } = useQuery({
    queryKey:  ["deal-products"],
    queryFn:   fetchDealProducts,
    staleTime: 2  * 60 * 1000,   // deals refresh more often
    gcTime:    10 * 60 * 1000,
  });

  /* ── set timer to first expiring deal ── */
  useEffect(() => {
    if (!products.length) return;

    // pick the soonest deal_ends_at that exists
    const endDates = products
      .map(p => p.deal_ends_at)
      .filter(Boolean)
      .map(d => new Date(d));

    const target = endDates.length > 0
      ? new Date(Math.min(...endDates))
      : new Date(Date.now() + 4 * 24 * 60 * 60 * 1000); // fallback 4 days

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [products]);

  /* ── placeholder tiles while loading ── */
  const tiles = isLoading
    ? Array.from({ length: 5 }, (_, i) => ({ id: `ph-${i}`, _ghost: true }))
    : products;

  return (
    <section className="w-full max-w-[1180px] mx-auto border border-[#DEE2E7] bg-white flex overflow-hidden">

      {/* ── Left — Timer ── */}
      <div className="w-[220px] shrink-0 border-r border-[#DEE2E7] flex flex-col justify-center px-5 py-4">
        <h3 className="text-base font-bold text-gray-900">Deals and offers</h3>
        <p className="text-xs text-gray-400 mb-4">Hygiene equipments</p>

        <div className="flex gap-2">
          {[
            { value: pad(timeLeft.days),    label: "Days" },
            { value: pad(timeLeft.hours),   label: "Hour" },
            { value: pad(timeLeft.minutes), label: "Min"  },
            { value: pad(timeLeft.seconds), label: "Sec"  },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#333] text-white rounded px-2.5 py-1.5 flex flex-col items-center min-w-[44px]"
            >
              <span className="text-base font-bold leading-tight">{item.value}</span>
              <span className="text-[10px] leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right — Products (5 cols) ── */}
      <div className="flex-1 grid grid-cols-5 divide-x divide-[#DEE2E7] h-[240px]">
        {tiles.map((product, index) => {

          /* skeleton tile */
          if (product._ghost) {
            return (
              <div key={product.id} className="flex flex-col items-center justify-center gap-3 py-4 px-3 animate-pulse">
                <div className="w-[120px] h-[120px] bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-20" />
                <div className="h-5 bg-gray-100 rounded-full w-14" />
              </div>
            );
          }

          const thumb   = getThumb(product);
          const disc    = discountPct(product.base_price, product.original_price);
          const catSlug = product.categories?.slug;

          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="flex flex-col items-center justify-center gap-2 py-4 px-3 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {/* Image */}
              <div className="w-[120px] h-[120px] flex items-center justify-center shrink-0">
                {thumb ? (
                  <img
                    src={thumb}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <ImageOff size={32} className="text-gray-300" />
                )}
              </div>

              {/* Name */}
              <p className="text-sm text-gray-700 text-center leading-tight line-clamp-1">
                {product.name}
              </p>

              {/* Discount badge — same colour as original */}
              {disc ? (
                <span className="bg-[#FFE3E3] text-red-500 text-xs font-medium px-3 py-0.5 rounded-full">
                  {disc}
                </span>
              ) : (
                <span className="bg-[#FFE3E3] text-red-500 text-xs font-medium px-3 py-0.5 rounded-full opacity-0 pointer-events-none">
                  —
                </span>
              )}
            </Link>
          );
        })}
      </div>

    </section>
  );
};

export default DealSection;