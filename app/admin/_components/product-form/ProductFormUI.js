/* ─────────────────────────────────────────────────────────────
   ProductFormUI.jsx
   Shared constants, primitive components, and helpers
   used across all ProductForm tab files.
───────────────────────────────────────────────────────────── */

/* ── slug helper ── */
export function toSlug(str) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

/* ── Tailwind class constants ── */
export const INPUT =
  "w-full h-10 px-3.5 border border-zinc-200 rounded-lg text-sm " +
  "placeholder-zinc-400 focus:ring-2 focus:ring-blue-500/20 " +
  "focus:border-blue-400 outline-none transition-all bg-white";

export const INPUT_DISABLED =
  "w-full h-10 px-3.5 border border-zinc-100 rounded-lg text-sm " +
  "text-zinc-400 bg-zinc-50 cursor-not-allowed outline-none";

export const SELECT =
  "w-full h-10 px-3.5 border border-zinc-200 rounded-lg text-sm " +
  "text-zinc-700 bg-white focus:ring-2 focus:ring-blue-500/20 " +
  "focus:border-blue-400 outline-none transition-all";

export const TEXTAREA =
  "w-full px-3.5 py-2.5 border border-zinc-200 rounded-lg text-sm " +
  "placeholder-zinc-400 focus:ring-2 focus:ring-blue-500/20 " +
  "focus:border-blue-400 outline-none transition-all bg-white resize-none";

/* ── EMPTY_FORM ── */
export const EMPTY_FORM = {
  name:             "",
  slug:             "",
  description:      "",
  category_id:      "",
  supplier_id:      "",
  base_price:       "",
  original_price:   "",
  stock:            "0",
  is_in_stock:      true,
  price_negotiable: false,
  product_type:     "",
  material:         "",
  design:           "",
  customization:    "",
  protection:       "",
  warranty:         "",
  is_featured:      false,
  is_deal:          false,
  is_recommended:   false,
  images:           [],   // { url, uploading, error, localPreview }
  image_url:        "",   // primary bucket URL
  deal_starts_at:   "",
  deal_ends_at:     "",
};

/* ── Tab definitions ── */
export const TABS = [
  { id: "basic",    label: "Basic Info",  icon: "Package"    },
  { id: "pricing",  label: "Pricing",     icon: "DollarSign" },
  { id: "details",  label: "Details",     icon: "Settings2"  },
  { id: "media",    label: "Media",       icon: "ImagePlus"  },
  { id: "meta",     label: "Visibility",  icon: "BarChart2"  },
];

/* ════════════════════════════════════════════════════════════
   Primitive UI components
═══════════════════════════════════════════════════════════ */

/** Labelled field wrapper */
export function Field({ label, icon, required, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-700">
        {icon}
        {label}
        {required
          ? <span className="text-red-500 ml-0.5">*</span>
          : <span className="text-xs text-zinc-400 font-normal ml-1">(optional)</span>
        }
      </label>
      {children}
      {hint && <p className="text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}

/** Pill toggle button */
export function Toggle({ label, desc, checked, onChange, color = "blue", icon }) {
  const border = {
    green:  "border-green-200 bg-green-50",
    blue:   "border-blue-200 bg-blue-50",
    amber:  "border-amber-200 bg-amber-50",
    red:    "border-red-200 bg-red-50",
    purple: "border-purple-200 bg-purple-50",
  };
  const text = {
    green:  "text-green-700",
    blue:   "text-blue-700",
    amber:  "text-amber-700",
    red:    "text-red-700",
    purple: "text-purple-700",
  };
  const track = {
    green:  "bg-green-500",
    blue:   "bg-blue-500",
    amber:  "bg-amber-500",
    red:    "bg-red-500",
    purple: "bg-purple-500",
  };

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between p-3.5 rounded-lg border transition-colors text-left w-full ${
        checked ? `${border[color]}` : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className={checked ? text[color] : "text-zinc-400"}>{icon}</span>
        )}
        <div>
          <p className={`text-sm font-medium ${checked ? text[color] : "text-zinc-700"}`}>
            {label}
          </p>
          {desc && <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className={`h-5 w-9 rounded-full transition-colors shrink-0 relative ${
        checked ? track[color] : "bg-zinc-300"
      }`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`} />
      </div>
    </button>
  );
}

/** Small coloured badge */
export function Badge({ label, color = "blue" }) {
  const map = {
    green:  "bg-green-100 text-green-700",
    amber:  "bg-amber-100 text-amber-700",
    red:    "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
    blue:   "bg-blue-100 text-blue-700",
    zinc:   "bg-zinc-100 text-zinc-600",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[color] ?? map.blue}`}>
      {label}
    </span>
  );
}

/** Yes/No status row */
export function StatusRow({ label, on }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className={`text-xs font-medium ${on ? "text-green-600" : "text-zinc-400"}`}>
        {on ? "Yes" : "No"}
      </span>
    </div>
  );
}

/** Completion check item */
export function CheckItem({ label, done }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${
        done ? "bg-green-500" : "bg-zinc-200"
      }`}>
        {done && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className={`text-xs ${done ? "text-zinc-700" : "text-zinc-400"}`}>{label}</span>
    </div>
  );
}

/** Tab error pill */
export function TabError({ message }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
      {message}
    </p>
  );
}