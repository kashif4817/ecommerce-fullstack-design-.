/* ─────────────────────────────────────────────────────────────
   TabMeta.jsx
   Tab 5 — Visibility flags + Deal timer (deal_starts_at / deal_ends_at)
───────────────────────────────────────────────────────────── */
"use client";

import { Star, Sparkles, Clock, AlertCircle } from "lucide-react";
import { INPUT, Field, Toggle, StatusRow } from "./ProductFormUI";

/* ── convert DB timestamptz → datetime-local input value ── */
function toDatetimeLocal(isoStr) {
  if (!isoStr) return "";
  // Slice to "YYYY-MM-DDTHH:MM" — exactly what datetime-local expects
  return new Date(isoStr).toISOString().slice(0, 16);
}

/* ── convert datetime-local input value → ISO string for DB ── */
function fromDatetimeLocal(val) {
  if (!val) return null;
  return new Date(val).toISOString();
}

export default function TabMeta({ form, setForm, tabErrors }) {
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleDealToggle = (val) => {
    setForm(prev => ({
      ...prev,
      is_deal:       val,
      // clear dates when deal is turned off
      deal_starts_at: val ? prev.deal_starts_at : "",
      deal_ends_at:   val ? prev.deal_ends_at   : "",
    }));
  };

  /* ── deal date validation warning (not a blocking error) ── */
  const dealWarning = (() => {
    if (!form.is_deal) return null;
    if (!form.deal_ends_at) return "Set an end date — otherwise the deal never expires.";
    if (form.deal_starts_at && form.deal_ends_at) {
      const start = new Date(form.deal_starts_at);
      const end   = new Date(form.deal_ends_at);
      if (end <= start) return "End date must be after start date.";
      if (end <= new Date()) return "End date is in the past — deal is already expired.";
    }
    return null;
  })();

  /* ── how long is the deal? ── */
  const dealDuration = (() => {
    if (!form.deal_starts_at || !form.deal_ends_at) return null;
    const diff = new Date(form.deal_ends_at) - new Date(form.deal_starts_at);
    if (diff <= 0) return null;
    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  })();

  return (
    <div className="space-y-5">

      {tabErrors?.meta && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {tabErrors.meta}
        </p>
      )}

      <p className="text-xs text-zinc-500 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2.5">
        Control how this product appears across the storefront and featured sections.
      </p>

      {/* ── Visibility toggles ── */}
      <div className="space-y-3">
        <Toggle
          label="Featured Product"
          desc="Show in featured / hero sections on the storefront"
          checked={form.is_featured}
          onChange={v => set("is_featured", v)}
          color="amber"
          icon={<Star size={14} />}
        />

        <Toggle
          label="Deal / Offer"
          desc="Highlight as a special deal — set start & end dates below"
          checked={form.is_deal}
          onChange={handleDealToggle}
          color="red"
          icon={<Sparkles size={14} />}
        />

        {/* ── Deal date pickers — only shown when is_deal is ON ── */}
        {form.is_deal && (
          <div className="ml-4 pl-4 border-l-2 border-red-100 space-y-4">

            {/* Warning */}
            {dealWarning && (
              <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                <AlertCircle size={13} className="mt-0.5 shrink-0" />
                {dealWarning}
              </div>
            )}

            {/* Duration badge */}
            {dealDuration && !dealWarning && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
                <Clock size={12} />
                Deal runs for <strong>{dealDuration}</strong>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Deal Starts At"
                icon={<Clock size={13} className="text-zinc-400" />}
                hint="Leave blank to start immediately"
              >
                <input
                  type="datetime-local"
                  value={toDatetimeLocal(form.deal_starts_at)}
                  onChange={e =>
                    set("deal_starts_at", fromDatetimeLocal(e.target.value))
                  }
                  className={INPUT}
                />
              </Field>

              <Field
                label="Deal Ends At"
                icon={<Clock size={13} className="text-zinc-400" />}
                hint="Product stops showing as deal after this"
              >
                <input
                  type="datetime-local"
                  value={toDatetimeLocal(form.deal_ends_at)}
                  onChange={e =>
                    set("deal_ends_at", fromDatetimeLocal(e.target.value))
                  }
                  className={INPUT}
                />
              </Field>
            </div>

            <p className="text-xs text-zinc-400">
              The storefront queries <code className="font-mono text-zinc-500">deal_ends_at &gt;= now()</code>,
              so the deal disappears automatically when time runs out — no manual action needed.
            </p>
          </div>
        )}

        <Toggle
          label="Recommended"
          desc="Show in 'You may also like' and recommendation widgets"
          checked={form.is_recommended}
          onChange={v => set("is_recommended", v)}
          color="purple"
          icon={<Star size={14} />}
        />
      </div>

      {/* ── Status summary ── */}
      <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 space-y-1.5 mt-2">
        <p className="text-xs font-semibold text-zinc-600 mb-2">Current visibility</p>
        <StatusRow label="In Stock"      on={form.is_in_stock}      />
        <StatusRow label="Featured"      on={form.is_featured}      />
        <StatusRow label="Deal"          on={form.is_deal}          />
        <StatusRow label="Recommended"   on={form.is_recommended}   />
        <StatusRow label="Negotiable"    on={form.price_negotiable} />
        {form.is_deal && form.deal_ends_at && (
          <div className="flex items-center justify-between pt-1 border-t border-zinc-200 mt-1">
            <span className="text-xs text-zinc-500">Deal ends</span>
            <span className="text-xs font-medium text-red-600">
              {new Date(form.deal_ends_at).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}