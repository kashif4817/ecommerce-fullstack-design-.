/* ─────────────────────────────────────────────────────────────
   TabBasic.jsx
   Tab 1 — Name, slug, description, category, supplier
───────────────────────────────────────────────────────────── */
"use client";

import { useState, useMemo } from "react";
import { Tag, Package, Layers, Search, ChevronDown } from "lucide-react";
import { INPUT, TEXTAREA, Field, TabError, toSlug } from "./ProductFormUI";

export default function TabBasic({
  form,
  setForm,
  categories,
  suppliers,
  slugEdited,
  setSlugEdited,
  tabErrors,
}) {
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleNameChange = (val) => {
    setForm(prev => ({
      ...prev,
      name: val,
      slug: slugEdited ? prev.slug : toSlug(val),
    }));
  };

  // Reusable Searchable Select with Search Bar on Top
  const SearchableSelect = ({ 
    options, 
    value, 
    onChange, 
    placeholder, 
    label, 
    icon 
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredOptions = useMemo(() => {
      if (!searchTerm.trim()) return options;
      const q = searchTerm.toLowerCase();
      return options.filter(opt => 
        opt.name.toLowerCase().includes(q)
      );
    }, [options, searchTerm]);

    const selectedOption = options.find(opt => opt.id === value);

    return (
      <div className="space-y-1.5">
        {/* Label */}
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
          {icon}
          {label}
        </div>

        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-11 px-4 bg-white border border-zinc-200 rounded-lg text-left flex items-center justify-between hover:border-zinc-300 focus:border-blue-500 transition-all"
        >
          <span className={value ? "text-zinc-900" : "text-zinc-400"}>
            {selectedOption ? selectedOption.name : placeholder}
          </span>
          <ChevronDown 
            size={16} 
            className={`text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} 
          />
        </button>

        {/* Dropdown with Search on Top */}
        {isOpen && (
          <div className="relative z-50 w-full bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden">
            
            {/* Search Bar - Always Visible at Top */}
            <div className="p-3 border-b border-zinc-100 bg-zinc-50">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-zinc-100 transition-colors flex items-center justify-between ${
                      value === option.id ? "bg-blue-50 text-blue-700" : "text-zinc-700"
                    }`}
                  >
                    <span>{option.name}</span>
                    {value === option.id && <span className="text-blue-600">✓</span>}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-zinc-400 text-sm">
                  No matching {label.toLowerCase()} found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <TabError message={tabErrors.basic} />

      {/* Name */}
      <Field
        label="Product Name"
        icon={<Tag size={13} className="text-zinc-400" />}
        required
      >
        <input
          type="text"
          value={form.name}
          onChange={e => handleNameChange(e.target.value)}
          placeholder="e.g. Analog Wristwatch Gold Edition"
          className={INPUT}
        />
      </Field>

      {/* Slug */}
      <Field
        label="Slug"
        icon={<Tag size={13} className="text-zinc-400" />}
        required
        hint="Auto-generated from name. Lowercase, numbers and hyphens only."
      >
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400 select-none">/</span>
          <input
            type="text"
            value={form.slug}
            onChange={e => {
              setSlugEdited(true);
              set("slug", toSlug(e.target.value));
            }}
            placeholder="auto-generated-from-name"
            className={INPUT + " pl-6 font-mono"}
          />
        </div>
      </Field>

      {/* Description */}
      <Field
        label="Description"
        icon={<Layers size={13} className="text-zinc-400" />}
      >
        <textarea
          rows={4}
          value={form.description}
          onChange={e => set("description", e.target.value)}
          placeholder="Describe the product — features, use case, highlights..."
          className={TEXTAREA}
        />
      </Field>

      {/* Category + Supplier - Searchable with Search Bar on Top */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SearchableSelect
          options={categories}
          value={form.category_id}
          onChange={(val) => set("category_id", val)}
          placeholder="— Select category —"
          label="Category"
          icon={<Tag size={14} className="text-zinc-500" />}
        />

        <SearchableSelect
          options={suppliers}
          value={form.supplier_id}
          onChange={(val) => set("supplier_id", val)}
          placeholder="— Select supplier —"
          label="Supplier"
          icon={<Package size={14} className="text-zinc-500" />}
        />
      </div>
    </div>
  );
}