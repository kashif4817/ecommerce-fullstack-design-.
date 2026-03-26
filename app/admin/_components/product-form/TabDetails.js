/* ─────────────────────────────────────────────────────────────
   TabDetails.jsx
   Tab 3 — product_type, material, design, protection,
            customization, protection
───────────────────────────────────────────────────────────── */
"use client";

import { Package, Layers, Sparkles, ShieldCheck, Wrench } from "lucide-react";
import { INPUT, TEXTAREA, Field } from "./ProductFormUI";

export default function TabDetails({ form, setForm }) {
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-5">

      <div className="grid grid-cols-2 gap-4">
        <Field label="Product Type" icon={<Package size={13} className="text-zinc-400" />}>
          <input
            type="text"
            value={form.product_type}
            onChange={e => set("product_type", e.target.value)}
            placeholder="e.g. Analog, Digital, Smart"
            className={INPUT}
          />
        </Field>

        <Field label="Material" icon={<Layers size={13} className="text-zinc-400" />}>
          <input
            type="text"
            value={form.material}
            onChange={e => set("material", e.target.value)}
            placeholder="e.g. Stainless Steel, Leather"
            className={INPUT}
          />
        </Field>

        <Field label="Design / Style" icon={<Sparkles size={13} className="text-zinc-400" />}>
          <input
            type="text"
            value={form.design}
            onChange={e => set("design", e.target.value)}
            placeholder="e.g. Minimalist, Classic, Sport"
            className={INPUT}
          />
        </Field>

        <Field label="Protection" icon={<ShieldCheck size={13} className="text-zinc-400" />}>
          <input
            type="text"
            value={form.protection}
            onChange={e => set("protection", e.target.value)}
            placeholder="e.g. Water resistant 30m, IP68"
            className={INPUT}
          />
        </Field>
      </div>

      <Field
        label="Customization"
        icon={<Wrench size={13} className="text-zinc-400" />}
        hint="What can be customized? e.g. Logo engraving, strap color, packaging"
      >
        <textarea
          rows={3}
          value={form.customization}
          onChange={e => set("customization", e.target.value)}
          placeholder="e.g. Engravable case back, interchangeable straps, custom packaging..."
          className={TEXTAREA}
        />
      </Field>

    </div>
  );
}