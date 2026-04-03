"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  LayoutGrid,
  Rows3,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import CategoryBar from "@/components/layout/CategoryBar";
import Footer from "@/components/layout/Footer";
import Newsletter from "@/components/layout/NewsLetter";
import { supabase } from "@/lib/supabase";
import CatalogFilters from "./_components/CatalogFilters";
import CatalogPagination from "./_components/CatalogPagination";
import {
  EmptyState,
  ProductGridCard,
  ProductListCard,
  ProductsSkeleton,
} from "./_components/CatalogCards";

const GRID_PAGE_SIZE = 9;
const LIST_PAGE_SIZE = 6;

const SORT_OPTIONS = [
  { value: "featured", label: "Featured first" },
  { value: "newest", label: "Newest first" },
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Top rated" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

const RATING_OPTIONS = [
  { value: 8, label: "4 stars & up" },
  { value: 6, label: "3 stars & up" },
  { value: 4, label: "2 stars & up" },
];

async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");
  if (error) throw new Error(error.message);
  return data || [];
}

async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `id, name, slug, description, base_price, original_price, image_url,
       images, is_in_stock, stock, rating, review_count, units_sold,
       created_at, category_id, product_type, material, is_featured,
       is_deal, is_recommended, categories ( id, name, slug )`
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

function toggleSelection(items, value) {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}

/* ─── Fallback skeleton while Suspense loads ─────── */
function ProductsPageFallback() {
  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <Navbar />
      <CategoryBar />
      <main className="mx-auto max-w-[1440px] px-4 py-6">
        <div className="space-y-4">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
          <div className="rounded-2xl border border-[#DEE2E7] bg-white p-5 shadow-sm">
            <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-11 w-full animate-pulse rounded-xl bg-slate-100" />
          </div>
          <ProductsSkeleton viewMode="grid" />
        </div>
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
}

/* ─── Main content ───────────────────────────────── */
function ProductsPageContent({ searchKey }) {
  const initialParams = new URLSearchParams(searchKey);
  const initialSearch = initialParams.get("search") ?? initialParams.get("q") ?? "";
  const initialCategoryId = initialParams.get("category") ?? "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(GRID_PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [stockOnly, setStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [dealOnly, setDealOnly] = useState(false);
  const [recommendedOnly, setRecommendedOnly] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [priceInputs, setPriceInputs] = useState({ min: "", max: "" });
  const [priceFilter, setPriceFilter] = useState({ min: null, max: null });
  const [minRating, setMinRating] = useState(0);

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } =
    useQuery({
      queryKey: ["store-product-categories"],
      queryFn: fetchCategories,
      staleTime: 10 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
    });

  const { data: products = [], isLoading: productsLoading, error: productsError } =
    useQuery({
      queryKey: ["store-products-catalog"],
      queryFn: fetchProducts,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    });

  /* ── Derived facet data ── */
  const categoryCounts = useMemo(() =>
    products.reduce((counts, p) => {
      const key = String(p.category_id ?? "");
      if (!key) return counts;
      counts[key] = (counts[key] ?? 0) + 1;
      return counts;
    }, {}),
  [products]);

  const filterCategories = useMemo(
    () => categories.filter((c) => (categoryCounts[String(c.id)] ?? 0) > 0),
    [categories, categoryCounts]
  );

  const activeCategory =
    filterCategories.find((c) => String(c.id) === String(selectedCategoryId)) || null;

  const facetProducts = useMemo(
    () =>
      selectedCategoryId
        ? products.filter((p) => String(p.category_id) === String(selectedCategoryId))
        : products,
    [products, selectedCategoryId]
  );

  const typeOptions = useMemo(() =>
    Array.from(new Set(facetProducts.map((p) => p.product_type?.trim()).filter(Boolean))).sort(),
  [facetProducts]);

  const materialOptions = useMemo(() =>
    Array.from(new Set(facetProducts.map((p) => p.material?.trim()).filter(Boolean))).sort(),
  [facetProducts]);

  const priceBounds = useMemo(() => {
    const prices = facetProducts
      .map((p) => Number(p.base_price ?? 0))
      .filter(Number.isFinite);
    if (!prices.length) return { min: 0, max: 0 };
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [facetProducts]);

  const ratingCounts = useMemo(
    () =>
      RATING_OPTIONS.map((opt) => ({
        ...opt,
        count: facetProducts.filter((p) => Number(p.rating ?? 0) >= opt.value).length,
      })).filter((opt) => opt.count > 0),
    [facetProducts]
  );

  /* ── Filtered & sorted list ── */
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = products.filter((p) => {
      if (selectedCategoryId && String(p.category_id) !== String(selectedCategoryId)) return false;
      if (query && ![p.name, p.description, p.categories?.name, p.product_type, p.material]
        .filter(Boolean).some((v) => v.toLowerCase().includes(query))) return false;
      if (stockOnly && !p.is_in_stock) return false;
      if (featuredOnly && !p.is_featured) return false;
      if (dealOnly && !p.is_deal) return false;
      if (recommendedOnly && !p.is_recommended) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(p.product_type)) return false;
      if (selectedMaterials.length > 0 && !selectedMaterials.includes(p.material)) return false;
      const price = Number(p.base_price ?? 0);
      if (priceFilter.min !== null && price < priceFilter.min) return false;
      if (priceFilter.max !== null && price > priceFilter.max) return false;
      if (minRating > 0 && Number(p.rating ?? 0) < minRating) return false;
      return true;
    });

    list.sort((l, r) => {
      if (sortBy === "price_asc") return Number(l.base_price ?? 0) - Number(r.base_price ?? 0);
      if (sortBy === "price_desc") return Number(r.base_price ?? 0) - Number(l.base_price ?? 0);
      if (sortBy === "popular") return Number(r.units_sold ?? 0) - Number(l.units_sold ?? 0);
      if (sortBy === "rating") return Number(r.rating ?? 0) - Number(l.rating ?? 0);
      if (sortBy === "newest") return new Date(r.created_at ?? 0) - new Date(l.created_at ?? 0);
      const score = (p) => (p.is_featured ? 4 : 0) + (p.is_deal ? 2 : 0) + (p.is_recommended ? 1 : 0);
      const sd = score(r) - score(l);
      if (sd !== 0) return sd;
      const ud = Number(r.units_sold ?? 0) - Number(l.units_sold ?? 0);
      if (ud !== 0) return ud;
      return new Date(r.created_at ?? 0) - new Date(l.created_at ?? 0);
    });

    return list;
  }, [dealOnly, featuredOnly, minRating, priceFilter, products, recommendedOnly, search,
      selectedCategoryId, selectedMaterials, selectedTypes, sortBy, stockOnly]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [currentPage, filteredProducts, pageSize]);

  /* ── Active filter metadata ── */
  const activeFilterCount =
    (search.trim() ? 1 : 0) +
    (selectedCategoryId ? 1 : 0) +
    (stockOnly ? 1 : 0) + (featuredOnly ? 1 : 0) + (dealOnly ? 1 : 0) + (recommendedOnly ? 1 : 0) +
    selectedTypes.length + selectedMaterials.length +
    (priceFilter.min !== null || priceFilter.max !== null ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  const activeBadges = [
    ...(search.trim() ? [`Search: ${search.trim()}`] : []),
    ...(activeCategory?.name ? [activeCategory.name] : []),
    ...(stockOnly ? ["In stock"] : []),
    ...(featuredOnly ? ["Featured"] : []),
    ...(dealOnly ? ["Deals"] : []),
    ...(recommendedOnly ? ["Recommended"] : []),
    ...selectedTypes,
    ...selectedMaterials,
    ...(priceFilter.min !== null || priceFilter.max !== null
      ? [`$${priceFilter.min ?? priceBounds.min} – $${priceFilter.max ?? priceBounds.max}`]
      : []),
    ...(minRating > 0 ? [`${Math.round(minRating / 2)} stars & up`] : []),
  ];

  const showEmptyState =
    !productsLoading && !categoriesLoading &&
    !productsError && !categoriesError &&
    filteredProducts.length === 0;

  /* ── Handlers ── */
  const clearPriceFilter = () => {
    setPriceInputs({ min: "", max: "" });
    setPriceFilter({ min: null, max: null });
    setPage(1);
  };

  const applyPriceFilter = () => {
    const minV = priceInputs.min === "" ? null : parseFloat(priceInputs.min);
    const maxV = priceInputs.max === "" ? null : parseFloat(priceInputs.max);
    const nextMin = Number.isFinite(minV) ? minV : null;
    const nextMax = Number.isFinite(maxV) ? maxV : null;
    if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
      setPriceInputs({ min: String(nextMax), max: String(nextMin) });
      setPriceFilter({ min: nextMax, max: nextMin });
    } else {
      setPriceFilter({ min: nextMin, max: nextMax });
    }
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearch(""); setSelectedCategoryId(""); setStockOnly(false);
    setFeaturedOnly(false); setDealOnly(false); setRecommendedOnly(false);
    setSelectedTypes([]); setSelectedMaterials([]);
    setPriceInputs({ min: "", max: "" }); setPriceFilter({ min: null, max: null });
    setMinRating(0); setPage(1);
  };

  const handleViewChange = (next) => {
    setViewMode(next);
    setPage(1);
    setPageSize(next === "grid" ? GRID_PAGE_SIZE : LIST_PAGE_SIZE);
  };

  /* ── Shared filters panel ── */
  const filtersPanel = (
    <CatalogFilters
      products={facetProducts}
      allProductsCount={products.length}
      categories={filterCategories}
      categoryCounts={categoryCounts}
      selectedCategoryId={selectedCategoryId}
      setSelectedCategoryId={setSelectedCategoryId}
      stockOnly={stockOnly} setStockOnly={setStockOnly}
      featuredOnly={featuredOnly} setFeaturedOnly={setFeaturedOnly}
      dealOnly={dealOnly} setDealOnly={setDealOnly}
      recommendedOnly={recommendedOnly} setRecommendedOnly={setRecommendedOnly}
      typeOptions={typeOptions}
      selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes}
      materialOptions={materialOptions}
      selectedMaterials={selectedMaterials} setSelectedMaterials={setSelectedMaterials}
      priceBounds={priceBounds}
      priceInputs={priceInputs} setPriceInputs={setPriceInputs}
      applyPriceFilter={applyPriceFilter} clearPriceFilter={clearPriceFilter}
      minRating={minRating} setMinRating={setMinRating}
      ratingCounts={ratingCounts}
      setPage={setPage}
      clearAllFilters={clearAllFilters}
      activeFilterCount={activeFilterCount}
      toggleSelection={toggleSelection}
    />
  );

  /* ─────────────────────── RENDER ─────────────────────── */
  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <Navbar />
      <CategoryBar />

      <main className="mx-auto max-w-[1440px] px-4 py-4 sm:py-6">
        <div className="space-y-4">

          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-slate-300">{"›"}</span>
            <span className="text-blue-600">Products</span>
          </nav>

          {/* ── Top control bar ─────────────────────────── */}
          <section className="overflow-hidden rounded-2xl border border-[#DEE2E7] bg-white shadow-sm">

            {/* Header */}
            <div className="border-b border-[#EFF2F4] px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
                    Product catalog
                  </p>
                  <h1 className="mt-0.5 text-xl font-semibold text-slate-900 sm:text-2xl">
                    {activeCategory?.name || "All products"}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#DEE2E7] bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {filteredProducts.length.toLocaleString()} items
                  </span>
                </div>
              </div>
            </div>

            {/* Search + Sort + View toggle row */}
            <div className="grid gap-2 p-3 sm:grid-cols-[1fr_auto] lg:grid-cols-[minmax(0,1fr)_200px_auto] lg:items-center">

              {/* Search */}
              <label className="relative block">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search products…"
                  className="h-11 w-full rounded-xl border border-[#DEE2E7] bg-white pl-10 pr-9 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => { setSearch(""); setPage(1); }}
                    className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </label>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="h-11 w-full appearance-none rounded-xl border border-[#DEE2E7] bg-white pl-3.5 pr-9 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* Right controls: mobile filter btn + view toggle */}
              <div className="flex items-center justify-between gap-2 sm:justify-end">
                {/* Mobile filter button */}
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="relative inline-flex h-11 items-center gap-2 rounded-xl border border-[#DEE2E7] bg-white px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
                >
                  <SlidersHorizontal size={15} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Grid / List toggle */}
                <div className="inline-flex rounded-xl border border-[#DEE2E7] bg-white p-1">
                  <button
                    type="button"
                    onClick={() => handleViewChange("grid")}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewChange("list")}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                      viewMode === "list" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"
                    }`}
                    aria-label="List view"
                  >
                    <Rows3 size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter badges */}
            {activeBadges.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 border-t border-[#EFF2F4] px-4 py-2.5">
                {activeBadges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    {badge}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              </div>
            )}
          </section>

          {/* ── Two-column layout: Sidebar + Products ── */}
          <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">

            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">{filtersPanel}</div>
            </aside>

            {/* Products area */}
            <section className="space-y-4">

              {/* Results header bar */}
              <div className="flex flex-col gap-1.5 rounded-xl border border-[#DEE2E7] bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Showing
                  </p>
                  <h2 className="text-base font-semibold text-slate-900">
                    {activeCategory?.name || "All categories"}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>{filteredProducts.length.toLocaleString()} results</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>Page {currentPage} of {totalPages}</span>
                </div>
              </div>

              {/* Loading skeleton */}
              {(productsLoading || categoriesLoading) && <ProductsSkeleton viewMode={viewMode} />}

              {/* Error state */}
              {(productsError || categoriesError) && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-5 text-sm text-red-600">
                  {productsError?.message || categoriesError?.message || "Unable to load products right now."}
                </div>
              )}

              {/* Empty state */}
              {showEmptyState && (
                <EmptyState hasFilter={activeFilterCount > 0} onReset={clearAllFilters} />
              )}

              {/* Product grid */}
              {!productsLoading && !categoriesLoading && !productsError && !categoriesError &&
                paginatedProducts.length > 0 && (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
                      {paginatedProducts.map((p) => (
                        <ProductGridCard key={p.id} product={p} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {paginatedProducts.map((p) => (
                        <ProductListCard key={p.id} product={p} />
                      ))}
                    </div>
                  )
              )}

              {/* Pagination */}
              {!productsLoading && !categoriesLoading && !productsError && !categoriesError && (
                <CatalogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={filteredProducts.length}
                  onPageChange={setPage}
                  onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
                />
              )}
            </section>
          </div>
        </div>
      </main>

      <Newsletter />
      <Footer />

      {/* ── Mobile filter drawer overlay ── */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        />
      )}

      {/* ── Mobile filter drawer ── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[290px] max-w-[88vw] overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex h-14 items-center justify-between border-b border-[#EFF2F4] px-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Filters</p>
            <p className="text-[11px] text-slate-400">
              {filteredProducts.length.toLocaleString()} products
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DEE2E7] text-slate-500 hover:bg-slate-50"
            aria-label="Close filters"
          >
            <X size={15} />
          </button>
        </div>

        {/* Drawer body */}
        <div className="h-[calc(100dvh-56px)] overflow-y-auto bg-[#F7FAFC] p-3">
          {filtersPanel}
        </div>
      </div>
    </div>
  );
}

/* ─── Shell + Suspense ───────────────────────────── */
function ProductsPageShell() {
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  return <ProductsPageContent key={searchKey} searchKey={searchKey} />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageShell />
    </Suspense>
  );
}