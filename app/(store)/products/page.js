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

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id, name, slug, description,
        base_price, original_price,
        image_url, images,
        is_in_stock, stock,
        rating, review_count, units_sold,
        created_at, category_id,
        product_type, material,
        is_featured, is_deal, is_recommended,
        categories ( id, name, slug )
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

function toggleSelection(items, value) {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}

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

function ProductsPageContent({ searchKey }) {
  const initialParams = new URLSearchParams(searchKey);
  const initialSearch =
    initialParams.get("search") ?? initialParams.get("q") ?? "";
  const initialCategoryId = initialParams.get("category") ?? "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(initialCategoryId);
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

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["store-product-categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["store-products-catalog"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const categoryCounts = useMemo(() => {
    return products.reduce((counts, product) => {
      const key = String(product.category_id ?? "");

      if (!key) {
        return counts;
      }

      counts[key] = (counts[key] ?? 0) + 1;
      return counts;
    }, {});
  }, [products]);

  const filterCategories = useMemo(() => {
    return categories.filter(
      (category) => (categoryCounts[String(category.id)] ?? 0) > 0
    );
  }, [categories, categoryCounts]);

  const activeCategory =
    filterCategories.find(
      (category) => String(category.id) === String(selectedCategoryId)
    ) || null;

  const facetProducts = useMemo(() => {
    if (!selectedCategoryId) {
      return products;
    }

    return products.filter(
      (product) => String(product.category_id) === String(selectedCategoryId)
    );
  }, [products, selectedCategoryId]);

  const typeOptions = useMemo(() => {
    return Array.from(
      new Set(
        facetProducts
          .map((product) => product.product_type?.trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [facetProducts]);

  const materialOptions = useMemo(() => {
    return Array.from(
      new Set(
        facetProducts
          .map((product) => product.material?.trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [facetProducts]);

  const priceBounds = useMemo(() => {
    const prices = facetProducts
      .map((product) => Number(product.base_price ?? 0))
      .filter((value) => Number.isFinite(value));

    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [facetProducts]);

  const ratingCounts = useMemo(() => {
    return RATING_OPTIONS.map((option) => ({
      ...option,
      count: facetProducts.filter(
        (product) => Number(product.rating ?? 0) >= option.value
      ).length,
    })).filter((option) => option.count > 0);
  }, [facetProducts]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = products.filter((product) => {
      if (
        selectedCategoryId &&
        String(product.category_id) !== String(selectedCategoryId)
      ) {
        return false;
      }

      if (
        query &&
        ![
          product.name,
          product.description,
          product.categories?.name,
          product.product_type,
          product.material,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query))
      ) {
        return false;
      }

      if (stockOnly && !product.is_in_stock) {
        return false;
      }

      if (featuredOnly && !product.is_featured) {
        return false;
      }

      if (dealOnly && !product.is_deal) {
        return false;
      }

      if (recommendedOnly && !product.is_recommended) {
        return false;
      }

      if (
        selectedTypes.length > 0 &&
        !selectedTypes.includes(product.product_type)
      ) {
        return false;
      }

      if (
        selectedMaterials.length > 0 &&
        !selectedMaterials.includes(product.material)
      ) {
        return false;
      }

      const price = Number(product.base_price ?? 0);

      if (priceFilter.min !== null && price < priceFilter.min) {
        return false;
      }

      if (priceFilter.max !== null && price > priceFilter.max) {
        return false;
      }

      if (minRating > 0 && Number(product.rating ?? 0) < minRating) {
        return false;
      }

      return true;
    });

    list.sort((left, right) => {
      if (sortBy === "price_asc") {
        return Number(left.base_price ?? 0) - Number(right.base_price ?? 0);
      }

      if (sortBy === "price_desc") {
        return Number(right.base_price ?? 0) - Number(left.base_price ?? 0);
      }

      if (sortBy === "popular") {
        return Number(right.units_sold ?? 0) - Number(left.units_sold ?? 0);
      }

      if (sortBy === "rating") {
        return Number(right.rating ?? 0) - Number(left.rating ?? 0);
      }

      if (sortBy === "newest") {
        return new Date(right.created_at ?? 0) - new Date(left.created_at ?? 0);
      }

      const score = (product) =>
        (product.is_featured ? 4 : 0) +
        (product.is_deal ? 2 : 0) +
        (product.is_recommended ? 1 : 0);

      const scoreDiff = score(right) - score(left);

      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      const soldDiff =
        Number(right.units_sold ?? 0) - Number(left.units_sold ?? 0);

      if (soldDiff !== 0) {
        return soldDiff;
      }

      return new Date(right.created_at ?? 0) - new Date(left.created_at ?? 0);
    });

    return list;
  }, [
    dealOnly,
    featuredOnly,
    minRating,
    priceFilter.max,
    priceFilter.min,
    products,
    recommendedOnly,
    search,
    selectedCategoryId,
    selectedMaterials,
    selectedTypes,
    sortBy,
    stockOnly,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [currentPage, filteredProducts, pageSize]);

  const activeFilterCount =
    (search.trim() ? 1 : 0) +
    (selectedCategoryId ? 1 : 0) +
    (stockOnly ? 1 : 0) +
    (featuredOnly ? 1 : 0) +
    (dealOnly ? 1 : 0) +
    (recommendedOnly ? 1 : 0) +
    selectedTypes.length +
    selectedMaterials.length +
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
    ...(
      priceFilter.min !== null || priceFilter.max !== null
        ? [
            `${"$"}${priceFilter.min ?? priceBounds.min} - ${"$"}${
              priceFilter.max ?? priceBounds.max
            }`,
          ]
        : []
    ),
    ...(minRating > 0 ? [`${Math.round(minRating / 2)} stars & up`] : []),
  ];

  const showEmptyState =
    !productsLoading &&
    !categoriesLoading &&
    !productsError &&
    !categoriesError &&
    filteredProducts.length === 0;

  const clearPriceFilter = () => {
    setPriceInputs({ min: "", max: "" });
    setPriceFilter({ min: null, max: null });
    setPage(1);
  };

  const applyPriceFilter = () => {
    const minValue =
      priceInputs.min === "" ? null : Number.parseFloat(priceInputs.min);
    const maxValue =
      priceInputs.max === "" ? null : Number.parseFloat(priceInputs.max);
    const nextMin = Number.isFinite(minValue) ? minValue : null;
    const nextMax = Number.isFinite(maxValue) ? maxValue : null;

    if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
      setPriceInputs({
        min: String(nextMax),
        max: String(nextMin),
      });
      setPriceFilter({ min: nextMax, max: nextMin });
      setPage(1);
      return;
    }

    setPriceFilter({ min: nextMin, max: nextMax });
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategoryId("");
    setStockOnly(false);
    setFeaturedOnly(false);
    setDealOnly(false);
    setRecommendedOnly(false);
    setSelectedTypes([]);
    setSelectedMaterials([]);
    setPriceInputs({ min: "", max: "" });
    setPriceFilter({ min: null, max: null });
    setMinRating(0);
    setPage(1);
  };

  const handleViewChange = (nextView) => {
    setViewMode(nextView);
    setPage(1);
    setPageSize(nextView === "grid" ? GRID_PAGE_SIZE : LIST_PAGE_SIZE);
  };

  const filtersPanel = (
    <CatalogFilters
      products={facetProducts}
      allProductsCount={products.length}
      categories={filterCategories}
      categoryCounts={categoryCounts}
      selectedCategoryId={selectedCategoryId}
      setSelectedCategoryId={setSelectedCategoryId}
      stockOnly={stockOnly}
      setStockOnly={setStockOnly}
      featuredOnly={featuredOnly}
      setFeaturedOnly={setFeaturedOnly}
      dealOnly={dealOnly}
      setDealOnly={setDealOnly}
      recommendedOnly={recommendedOnly}
      setRecommendedOnly={setRecommendedOnly}
      typeOptions={typeOptions}
      selectedTypes={selectedTypes}
      setSelectedTypes={setSelectedTypes}
      materialOptions={materialOptions}
      selectedMaterials={selectedMaterials}
      setSelectedMaterials={setSelectedMaterials}
      priceBounds={priceBounds}
      priceInputs={priceInputs}
      setPriceInputs={setPriceInputs}
      applyPriceFilter={applyPriceFilter}
      clearPriceFilter={clearPriceFilter}
      minRating={minRating}
      setMinRating={setMinRating}
      ratingCounts={ratingCounts}
      setPage={setPage}
      clearAllFilters={clearAllFilters}
      activeFilterCount={activeFilterCount}
      toggleSelection={toggleSelection}
    />
  );

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <Navbar />
      <CategoryBar />

      <main className="mx-auto max-w-[1440px] px-4 py-4 sm:py-6">
        <div className="space-y-5">
          <nav className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>{">"}</span>
            <span className="text-blue-600">Products</span>
          </nav>

          <section className="overflow-hidden rounded-2xl border border-[#DEE2E7] bg-white shadow-sm">
            <div className="border-b border-[#EFF2F4] bg-[linear-gradient(135deg,rgba(13,110,253,0.05),rgba(13,110,253,0.01))] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
                    Product catalog
                  </p>
                  <div>
                    <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                      {activeCategory?.name || "All products"}
                    </h1>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                      Browse every product in your store with template-style
                      filters, grid and list views, and responsive mobile
                      navigation.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                    {filteredProducts.length.toLocaleString()} products
                  </div>
                  <div className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600">
                    {viewMode === "grid" ? "Grid view" : "List view"}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_220px_auto] lg:items-center">
              <label className="relative block">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by product, category, type, or material"
                  className="h-12 w-full rounded-xl border border-[#DEE2E7] bg-white pl-11 pr-10 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </label>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value);
                    setPage(1);
                  }}
                  className="h-12 w-full appearance-none rounded-xl border border-[#DEE2E7] bg-white pl-4 pr-10 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="flex items-center justify-between gap-3 lg:justify-end">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#DEE2E7] px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>

                <div className="inline-flex rounded-xl border border-[#DEE2E7] bg-white p-1">
                  <button
                    type="button"
                    onClick={() => handleViewChange("grid")}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewChange("list")}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                    aria-label="List view"
                  >
                    <Rows3 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {activeBadges.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t border-[#EFF2F4] px-4 py-3">
                {activeBadges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
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

          <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-24">{filtersPanel}</div>
            </aside>

            <section className="space-y-4">
              <div className="rounded-xl border border-[#DEE2E7] bg-white px-4 py-3 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                      Showing
                    </p>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {activeCategory?.name || "All categories"}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span>{filteredProducts.length.toLocaleString()} results</span>
                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                </div>
              </div>

              {(productsLoading || categoriesLoading) && (
                <ProductsSkeleton viewMode={viewMode} />
              )}

              {(productsError || categoriesError) && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-5 text-sm text-red-600">
                  {productsError?.message ||
                    categoriesError?.message ||
                    "Unable to load products right now."}
                </div>
              )}

              {showEmptyState && (
                <EmptyState
                  hasFilter={activeFilterCount > 0}
                  onReset={clearAllFilters}
                />
              )}

              {!productsLoading &&
                !categoriesLoading &&
                !productsError &&
                !categoriesError &&
                paginatedProducts.length > 0 &&
                (viewMode === "grid" ? (
                  <div className="grid gap-4 grid-cols-2 xl:grid-cols-3">
                    {paginatedProducts.map((product) => (
                      <ProductGridCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedProducts.map((product) => (
                      <ProductListCard key={product.id} product={product} />
                    ))}
                  </div>
                ))}

              {!productsLoading &&
                !categoriesLoading &&
                !productsError &&
                !categoriesError && (
                  <CatalogPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={filteredProducts.length}
                    onPageChange={setPage}
                    onPageSizeChange={(nextSize) => {
                      setPageSize(nextSize);
                      setPage(1);
                    }}
                  />
                )}
            </section>
          </div>
        </div>
      </main>

      <Newsletter />
      <Footer />

      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[86vw] overflow-hidden bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#EFF2F4] px-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Filters</p>
            <p className="text-xs text-slate-400">
              Refine {filteredProducts.length.toLocaleString()} products
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DEE2E7] text-slate-500"
            aria-label="Close filters"
          >
            <X size={16} />
          </button>
        </div>

        <div className="h-[calc(100vh-64px)] overflow-y-auto bg-[#F7FAFC] p-4">
          {filtersPanel}
        </div>
      </div>
    </div>
  );
}

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
