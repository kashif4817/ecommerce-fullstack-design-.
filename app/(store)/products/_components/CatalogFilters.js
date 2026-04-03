"use client";

import { ChevronDown, ChevronUp, Star, X } from "lucide-react";
import { useState } from "react";

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#EFF2F4] py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-semibold text-slate-800"
      >
        {title}
        {open ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function CatalogFilters({
  allProductsCount,
  categories,
  categoryCounts,
  selectedCategoryId,
  setSelectedCategoryId,
  stockOnly,
  setStockOnly,
  featuredOnly,
  setFeaturedOnly,
  dealOnly,
  setDealOnly,
  recommendedOnly,
  setRecommendedOnly,
  typeOptions,
  selectedTypes,
  setSelectedTypes,
  materialOptions,
  selectedMaterials,
  setSelectedMaterials,
  priceBounds,
  priceInputs,
  setPriceInputs,
  applyPriceFilter,
  clearPriceFilter,
  minRating,
  setMinRating,
  ratingCounts,
  setPage,
  clearAllFilters,
  activeFilterCount,
  toggleSelection,
}) {
  const SHOW_MORE_LIMIT = 5;
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);
  const [showAllMaterials, setShowAllMaterials] = useState(false);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, SHOW_MORE_LIMIT);
  const visibleTypes = showAllTypes ? typeOptions : typeOptions.slice(0, SHOW_MORE_LIMIT);
  const visibleMaterials = showAllMaterials ? materialOptions : materialOptions.slice(0, SHOW_MORE_LIMIT);

  return (
    <div className="rounded-2xl border border-[#DEE2E7] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#EFF2F4] px-4 py-3">
        <span className="text-sm font-semibold text-slate-900">Filters</span>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X size={11} />
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="px-4">
        {/* Category */}
        <FilterSection title="Category">
          <ul className="space-y-1.5">
            <li>
              <button
                type="button"
                onClick={() => { setSelectedCategoryId(""); setPage(1); }}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors ${
                  !selectedCategoryId
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>All categories</span>
                <span className={`text-xs ${!selectedCategoryId ? "text-blue-400" : "text-slate-400"}`}>
                  {allProductsCount}
                </span>
              </button>
            </li>
            {visibleCategories.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => { setSelectedCategoryId(String(cat.id)); setPage(1); }}
                  className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors ${
                    String(selectedCategoryId) === String(cat.id)
                      ? "bg-blue-50 font-medium text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-xs ${String(selectedCategoryId) === String(cat.id) ? "text-blue-400" : "text-slate-400"}`}>
                    {categoryCounts[String(cat.id)] ?? 0}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {categories.length > SHOW_MORE_LIMIT && (
            <button
              type="button"
              onClick={() => setShowAllCategories((v) => !v)}
              className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              {showAllCategories ? "See less" : `See all (${categories.length})`}
            </button>
          )}
        </FilterSection>

        {/* Quick flags */}
        <FilterSection title="Features">
          <ul className="space-y-2">
            {[
              { label: "In stock only", value: stockOnly, setter: setStockOnly },
              { label: "Featured", value: featuredOnly, setter: setFeaturedOnly },
              { label: "Deals", value: dealOnly, setter: setDealOnly },
              { label: "Recommended", value: recommendedOnly, setter: setRecommendedOnly },
            ].map(({ label, value, setter }) => (
              <li key={label}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                  <span
                    className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                      value
                        ? "border-blue-600 bg-blue-600"
                        : "border-[#DEE2E7] bg-white"
                    }`}
                    onClick={() => { setter((v) => !v); setPage(1); }}
                  >
                    {value && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span onClick={() => { setter((v) => !v); setPage(1); }}>{label}</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>

        {/* Price range */}
        <FilterSection title="Price range">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  placeholder={priceBounds.min}
                  value={priceInputs.min}
                  onChange={(e) => setPriceInputs((p) => ({ ...p, min: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-[#DEE2E7] bg-white pl-6 pr-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                />
              </div>
              <span className="text-slate-400 text-xs">—</span>
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  placeholder={priceBounds.max}
                  value={priceInputs.max}
                  onChange={(e) => setPriceInputs((p) => ({ ...p, max: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-[#DEE2E7] bg-white pl-6 pr-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={applyPriceFilter}
                className="flex-1 rounded-lg bg-blue-600 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={clearPriceFilter}
                className="flex-1 rounded-lg border border-[#DEE2E7] py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </div>
        </FilterSection>

        {/* Ratings */}
        {ratingCounts.length > 0 && (
          <FilterSection title="Ratings">
            <ul className="space-y-2">
              {ratingCounts.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => { setMinRating(minRating === opt.value ? 0 : opt.value); setPage(1); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                      minRating === opt.value ? "bg-amber-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className={s <= Math.round(opt.value / 2) ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}
                        />
                      ))}
                    </span>
                    <span className="text-slate-600 text-xs">& up</span>
                    <span className="ml-auto text-xs text-slate-400">{opt.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </FilterSection>
        )}

        {/* Product Type */}
        {typeOptions.length > 0 && (
          <FilterSection title="Type" defaultOpen={false}>
            <ul className="space-y-2">
              {visibleTypes.map((type) => (
                <li key={type}>
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                    <span
                      className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                        selectedTypes.includes(type)
                          ? "border-blue-600 bg-blue-600"
                          : "border-[#DEE2E7] bg-white"
                      }`}
                      onClick={() => { setSelectedTypes(toggleSelection(selectedTypes, type)); setPage(1); }}
                    >
                      {selectedTypes.includes(type) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span onClick={() => { setSelectedTypes(toggleSelection(selectedTypes, type)); setPage(1); }}>{type}</span>
                  </label>
                </li>
              ))}
            </ul>
            {typeOptions.length > SHOW_MORE_LIMIT && (
              <button
                type="button"
                onClick={() => setShowAllTypes((v) => !v)}
                className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                {showAllTypes ? "See less" : `See all (${typeOptions.length})`}
              </button>
            )}
          </FilterSection>
        )}

        {/* Material */}
        {materialOptions.length > 0 && (
          <FilterSection title="Material" defaultOpen={false}>
            <ul className="space-y-2">
              {visibleMaterials.map((mat) => (
                <li key={mat}>
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                    <span
                      className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                        selectedMaterials.includes(mat)
                          ? "border-blue-600 bg-blue-600"
                          : "border-[#DEE2E7] bg-white"
                      }`}
                      onClick={() => { setSelectedMaterials(toggleSelection(selectedMaterials, mat)); setPage(1); }}
                    >
                      {selectedMaterials.includes(mat) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span onClick={() => { setSelectedMaterials(toggleSelection(selectedMaterials, mat)); setPage(1); }}>{mat}</span>
                  </label>
                </li>
              ))}
            </ul>
            {materialOptions.length > SHOW_MORE_LIMIT && (
              <button
                type="button"
                onClick={() => setShowAllMaterials((v) => !v)}
                className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                {showAllMaterials ? "See less" : `See all (${materialOptions.length})`}
              </button>
            )}
          </FilterSection>
        )}
      </div>
    </div>
  );
}