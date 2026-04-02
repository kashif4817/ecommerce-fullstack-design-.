"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

const MainSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .is("parent_id", null)
        .order("name")
        .limit(9);

      if (!error) setCategories(data || []);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <section className="w-full max-w-[1180px] mx-auto px-3 sm:px-4">
      <div className="md:hidden">
        <div className="relative min-h-[170px] overflow-hidden rounded-xl border border-[#DEE2E7] bg-gradient-to-r from-[#D9F4F3] to-[#C6E8FF]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),transparent_45%)]" />
          <div className="relative z-10 flex min-h-[170px] items-center justify-between px-4 py-5">
            <div className="max-w-[140px]">
              <p className="text-[11px] text-slate-600 mb-1">
                Latest trending
              </p>
              <h2 className="text-lg font-bold leading-tight text-slate-900">
                Electronics items
              </h2>
              <Link
                href="/browse/electronics"
                className="mt-3 inline-block rounded-md bg-white px-3 py-1.5 text-[11px] font-medium text-blue-600 shadow-sm transition-colors hover:bg-slate-100"
              >
                Learn more
              </Link>
            </div>

            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop"
              alt="Electronic items"
              className="h-[140px] w-[115px] object-cover object-left rounded-bl-[42px] rounded-tl-[18px] rounded-r-xl shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col lg:flex-row gap-3 overflow-hidden rounded-xl lg:rounded-none lg:h-[400px]">

        {/* ── Left Sidebar — Categories ── */}
        <div className="w-full lg:w-[200px] lg:shrink-0 bg-white border border-[#DEE2E7] rounded-xl lg:rounded-none overflow-hidden">
          {loading ? (
            <ul className="divide-y divide-gray-100">
              {Array.from({ length: 9 }).map((_, i) => (
                <li key={i} className="px-3 sm:px-4 py-[11px]">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="divide-y divide-gray-100 h-full max-h-[300px] lg:max-h-none overflow-y-auto lg:overflow-y-visible">
              {categories.map((cat) => (
                <li key={cat.id}>
                  {/* ── use /browse/[slug] so "Source now" page works ── */}
                  <Link
                    href={`/browse/${cat.slug}`}
                    className="flex items-center justify-between px-3 sm:px-4 py-[11px] hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 group text-sm"
                  >
                    <span className="truncate">{cat.name}</span>
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 shrink-0" />
                  </Link>
                </li>
              ))}

              {categories.length === 0 && (
                <li className="px-3 sm:px-4 py-3 text-xs text-gray-400">No categories yet</li>
              )}
            </ul>
          )}
        </div>

        {/* ── Center — Main Banner ── */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-r from-teal-300 to-cyan-200 rounded-xl lg:rounded-none min-h-[200px] lg:min-h-0">
          <div className="absolute inset-0 flex flex-col justify-center pl-4 sm:pl-8 lg:pl-10 z-10">
            <p className="text-teal-700 text-xs sm:text-sm mb-1">Latest trending</p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-5">
              Electronic<br />items
            </h2>
            <Link
              href="/browse/electronics"
              className="bg-white text-gray-800 px-4 sm:px-5 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors w-fit"
            >
              Learn more
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop"
            alt="Electronic items"
            className="absolute right-0 top-0 h-full w-[55%] object-cover hidden sm:block"
          />
        </div>

        {/* ── Right Side — User + Promo cards ── */}
        <div className="w-full lg:w-[200px] lg:shrink-0 flex flex-row lg:flex-col gap-2 sm:gap-3">

          {/* User card */}
          <div className="flex-1 lg:flex-none bg-white border border-[#DEE2E7] rounded-xl lg:rounded-none p-2 sm:p-4 flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold shrink-0">
                S
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight truncate">Hi, user</p>
                <p className="text-xs text-gray-400 leading-tight">let&apos;s get started</p>
              </div>
            </div>
            <Link
              href="/signup"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm py-1 sm:py-1.5 rounded transition-colors font-medium text-center"
            >
              Join now
            </Link>
            <Link
              href="/login"
              className="w-full border border-blue-500 text-blue-500 text-xs sm:text-sm py-1 sm:py-1.5 rounded hover:bg-blue-50 transition-colors font-medium text-center"
            >
              Log in
            </Link>
          </div>

          {/* Orange promo */}
          <div className="flex-1 lg:flex-none bg-[#FF8C00] rounded-xl lg:rounded-none p-3 sm:p-4 lg:flex-1 flex items-center min-h-[70px] sm:min-h-[80px]">
            <p className="text-white text-xs sm:text-sm font-medium leading-snug">
              Get US $10 off<br />with a new<br className="hidden lg:block" />supplier!
            </p>
          </div>

          {/* Teal promo */}
          <div className="flex-1 lg:flex-none bg-[#00B8D9] rounded-xl lg:rounded-none p-3 sm:p-4 lg:flex-1 flex items-center min-h-[70px] sm:min-h-[80px]">
            <p className="text-white text-xs sm:text-sm font-medium leading-snug">
              Send quotes with<br className="hidden lg:block" />supplier preferences
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MainSection;
