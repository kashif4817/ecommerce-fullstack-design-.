"use client";

import { SlidersHorizontal } from "lucide-react";
import { StarRating } from "./CatalogCards";

function FilterSection({ title, children }) {
  return (
    <section className="border-t border-[#EFF2F4] px-4 py-4 first:border-t-0">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function FilterCheckbox({ label, count, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-600">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span>{label}</span>
      </span>
      {typeof count === "number" && (
        <span className="text-xs text-slate-400">{count}</span>
      )}
    </label>
  );
}

function FilterRadio({ label, count, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-600">
      <span className="flex items-center gap-2">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span>{label}</span>
      </span>
      {typeof count === "number" && (
        <span className="text-xs text-slate-400">{count}</span>
      )}
    </label>
  );
}

export default function CatalogFilters({
  products,
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
  const inStockCount = products.filter((product) => product.is_in_stock).length;
  const featuredCount = products.filter((product) => product.is_featured).length;
  const dealCount = products.filter((product) => product.is_deal).length;
  const recommendedCount = products.filter(
    (product) => product.is_recommended
  ).length;
  const hasAvailabilityFilters =
    inStockCount > 0 ||
    featuredCount > 0 ||
    dealCount > 0 ||
    recommendedCount > 0;

  return (
    <div className="overflow-hidden rounded-xl border border-[#DEE2E7] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#EFF2F4] px-4 py-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Category">
        <button
          type="button"
          onClick={() => {
            setSelectedCategoryId("");
            setPage(1);
          }}
          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            !selectedCategoryId
              ? "bg-blue-50 text-blue-600"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <span>All categories</span>
          <span className="text-xs text-slate-400">{allProductsCount}</span>
        </button>

        {categories.map((category) => {
          const isActive = String(category.id) === selectedCategoryId;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setSelectedCategoryId(String(category.id));
                setPage(1);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="truncate">{category.name}</span>
              <span className="text-xs text-slate-400">
                {categoryCounts[String(category.id)] ?? 0}
              </span>
            </button>
          );
        })}
      </FilterSection>

      {hasAvailabilityFilters && (
        <FilterSection title="Availability">
          {inStockCount > 0 && (
            <FilterCheckbox
              label="In stock"
              count={inStockCount}
              checked={stockOnly}
              onChange={() => {
                setStockOnly((current) => !current);
                setPage(1);
              }}
            />
          )}
          {featuredCount > 0 && (
            <FilterCheckbox
              label="Featured"
              count={featuredCount}
              checked={featuredOnly}
              onChange={() => {
                setFeaturedOnly((current) => !current);
                setPage(1);
              }}
            />
          )}
          {dealCount > 0 && (
            <FilterCheckbox
              label="Deals"
              count={dealCount}
              checked={dealOnly}
              onChange={() => {
                setDealOnly((current) => !current);
                setPage(1);
              }}
            />
          )}
          {recommendedCount > 0 && (
            <FilterCheckbox
              label="Recommended"
              count={recommendedCount}
              checked={recommendedOnly}
              onChange={() => {
                setRecommendedOnly((current) => !current);
                setPage(1);
              }}
            />
          )}
        </FilterSection>
      )}

      {typeOptions.length > 0 && (
        <FilterSection title="Product type">
          {typeOptions.map((type) => (
            <FilterCheckbox
              key={type}
              label={type}
              count={
                products.filter((product) => product.product_type === type).length
              }
              checked={selectedTypes.includes(type)}
              onChange={() => {
                setSelectedTypes((current) => toggleSelection(current, type));
                setPage(1);
              }}
            />
          ))}
        </FilterSection>
      )}

      {materialOptions.length > 0 && (
        <FilterSection title="Material">
          {materialOptions.map((material) => (
            <FilterCheckbox
              key={material}
              label={material}
              count={
                products.filter((product) => product.material === material).length
              }
              checked={selectedMaterials.includes(material)}
              onChange={() => {
                setSelectedMaterials((current) =>
                  toggleSelection(current, material)
                );
                setPage(1);
              }}
            />
          ))}
        </FilterSection>
      )}

      <FilterSection title="Price range">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={priceBounds.min}
            placeholder={`${priceBounds.min}`}
            value={priceInputs.min}
            onChange={(event) =>
              setPriceInputs((current) => ({
                ...current,
                min: event.target.value,
              }))
            }
            className="h-10 rounded-lg border border-[#DEE2E7] px-3 text-sm text-slate-700 outline-none focus:border-blue-400"
          />
          <input
            type="number"
            min={priceBounds.min}
            placeholder={`${priceBounds.max}`}
            value={priceInputs.max}
            onChange={(event) =>
              setPriceInputs((current) => ({
                ...current,
                max: event.target.value,
              }))
            }
            className="h-10 rounded-lg border border-[#DEE2E7] px-3 text-sm text-slate-700 outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={applyPriceFilter}
            className="rounded-lg border border-blue-500 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={clearPriceFilter}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Clear
          </button>
        </div>
      </FilterSection>

      <FilterSection title="Ratings">
        <FilterRadio
          label="All ratings"
          count={products.length}
          checked={minRating === 0}
          onChange={() => {
            setMinRating(0);
            setPage(1);
          }}
        />

        {ratingCounts.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-600"
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                checked={minRating === option.value}
                onChange={() => {
                  setMinRating(option.value);
                  setPage(1);
                }}
                className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center gap-2">
                <StarRating rating={option.value} size={11} />
                <span>{option.label}</span>
              </span>
            </span>
            <span className="text-xs text-slate-400">{option.count}</span>
          </label>
        ))}
      </FilterSection>
    </div>
  );
}
