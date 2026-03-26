/* ─────────────────────────────────────────────────────────────
   TabPricing.jsx
   Tab 2 — Prices, stock, warranty, toggles
   
   Key rules:
   • base_price is REQUIRED (validated on submit)
   • price_negotiable ON  → base_price locked to 0, field disabled
   • price_negotiable OFF → base_price re-enabled, reset to ""
───────────────────────────────────────────────────────────── */
"use client";

import { DollarSign, BarChart2, ShieldCheck } from "lucide-react";
import { INPUT, INPUT_DISABLED, Field, Toggle, TabError } from "./ProductFormUI";

export default function TabPricing({ form, setForm, tabErrors }) {
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  /* Toggle price_negotiable:
     - turning ON  → set base_price = "0", lock field
     - turning OFF → clear base_price so user must re-enter  */
  const handleNegotiableToggle = (val) => {
    setForm(prev => ({
      ...prev,
      price_negotiable: val,
      base_price: val ? "0" : "",
    }));
  };

  const base     = Number(form.base_price);
  const original = Number(form.original_price);
  const hasDisc  = form.original_price && original > base && base >= 0;
  const discPct  = hasDisc ? Math.round((1 - base / original) * 100) : 0;

  return (
    <div className="space-y-5">
      <TabError message={tabErrors.pricing} />

      {/* Price negotiable notice */}
      {form.price_negotiable && (
        <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <DollarSign size={15} className="mt-0.5 shrink-0" />
          <span>
            Price is set to <strong>negotiable</strong>. Base price is locked at{" "}
            <strong>PKR 0</strong> and will show as "Price: Negotiable" on the storefront.
          </span>
        </div>
      )}

      {/* Base price + Original price */}
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Base Price (PKR)"
          icon={<DollarSign size={13} className="text-zinc-400" />}
          required
          hint={form.price_negotiable ? "Locked — price is negotiable" : undefined}
        >
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-medium select-none">
              PKR
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.base_price}
              onChange={e => set("base_price", e.target.value)}
              disabled={form.price_negotiable}
              placeholder={form.price_negotiable ? "0.00 (negotiable)" : "0.00"}
              className={(form.price_negotiable ? INPUT_DISABLED : INPUT) + " pl-11"}
            />
          </div>
        </Field>

        <Field
          label="Original / MRP Price (PKR)"
          icon={<DollarSign size={13} className="text-zinc-400" />}
          hint="Strikethrough price — set only if discounted"
        >
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-medium select-none">
              PKR
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.original_price}
              onChange={e => set("original_price", e.target.value)}
              placeholder="0.00"
              className={INPUT + " pl-11"}
            />
          </div>
        </Field>
      </div>

      {/* Discount preview */}
      {hasDisc && !form.price_negotiable && (
        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
            {discPct}% OFF
          </span>
          <span className="text-sm text-green-700">
            Customer saves PKR {(original - base).toLocaleString()}
          </span>
        </div>
      )}

      {/* Stock + Warranty */}
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Stock Quantity"
          icon={<BarChart2 size={13} className="text-zinc-400" />}
        >
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={e => set("stock", e.target.value)}
            placeholder="0"
            className={INPUT}
          />
        </Field>

        <Field
          label="Warranty"
          icon={<ShieldCheck size={13} className="text-zinc-400" />}
        >
          <input
            type="text"
            value={form.warranty}
            onChange={e => set("warranty", e.target.value)}
            placeholder="e.g. 1 year, 6 months, Lifetime"
            className={INPUT}
          />
        </Field>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-3">
        <Toggle
          label="In Stock"
          desc="Mark product as available"
          checked={form.is_in_stock}
          onChange={v => set("is_in_stock", v)}
          color="green"
        />
        <Toggle
          label="Price Negotiable"
          desc="Locks price to 0 — shows as negotiable"
          checked={form.price_negotiable}
          onChange={handleNegotiableToggle}
          color="blue"
        />
      </div>
    </div>
  );
}