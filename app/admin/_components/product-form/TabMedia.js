/* ─────────────────────────────────────────────────────────────
   TabMedia.jsx
   Tab 4 — image_url (primary bucket upload) + images[] (extra)

   Two sections:
   1. Primary Image — single file upload → image_url column
   2. Gallery Images — multiple uploads → images[] jsonb array
───────────────────────────────────────────────────────────── */
"use client";

import { useRef } from "react";
import {
  Upload, X, Loader2, AlertCircle, ImagePlus,
  Star, Images, Link as LinkIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { INPUT, Field } from "./ProductFormUI";

const BUCKET = "product-images";

/* ── upload a single file, return public URL or throw ── */
async function uploadFile(file) {
  const ext      = file.name.split(".").pop();
  const path     = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false });

  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return publicUrl;
}

export default function TabMedia({ form, setForm }) {
  const primaryRef  = useRef(null);
  const galleryRef  = useRef(null);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  /* ── Primary image upload ── */
  const handlePrimaryFile = async (file) => {
    // show local preview immediately
    set("_primaryUploading", true);
    set("_primaryPreview", URL.createObjectURL(file));
    try {
      const url = await uploadFile(file);
      setForm(prev => ({
        ...prev,
        image_url:         url,
        _primaryUploading: false,
        _primaryPreview:   url,
      }));
    } catch (err) {
      setForm(prev => ({
        ...prev,
        _primaryUploading: false,
        _primaryError:     err.message,
      }));
    }
  };

  const clearPrimary = () => {
    setForm(prev => ({
      ...prev,
      image_url:         "",
      _primaryPreview:   "",
      _primaryUploading: false,
      _primaryError:     "",
    }));
  };

  /* ── Gallery images upload ── */
  const handleGalleryFiles = async (files) => {
    const newEntries = Array.from(files).map(file => ({
      file,
      url:          "",
      uploading:    true,
      error:        "",
      localPreview: URL.createObjectURL(file),
    }));

    setForm(prev => ({
      ...prev,
      images: [...prev.images, ...newEntries],
    }));

    for (const entry of newEntries) {
      try {
        const url = await uploadFile(entry.file);
        setForm(prev => ({
          ...prev,
          images: prev.images.map(img =>
            img === entry
              ? { ...img, url, uploading: false }
              : img
          ),
        }));
      } catch (err) {
        setForm(prev => ({
          ...prev,
          images: prev.images.map(img =>
            img === entry
              ? { ...img, uploading: false, error: err.message }
              : img
          ),
        }));
      }
    }
  };

  const removeGalleryImage = (idx) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  /* ── display values ── */
  const primaryPreview  = form._primaryPreview || form.image_url;
  const primaryUploading = form._primaryUploading;
  const primaryError    = form._primaryError;

  return (
    <div className="space-y-7">

      {/* ══ SECTION 1: Primary Image ══ */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star size={14} className="text-amber-500" />
          <h3 className="text-sm font-semibold text-zinc-800">Primary Image</h3>
          <span className="text-xs text-zinc-400">(optional)</span>
          <span className="ml-auto text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
            Stored in Supabase bucket → <code className="font-mono">image_url</code>
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          This is the main product image shown on cards, listings and the deal section.
          Uploaded directly to Supabase Storage.
        </p>

        {primaryPreview ? (
          <div className="relative w-40 h-40 rounded-xl border border-zinc-200 overflow-hidden bg-zinc-100 group">
            <img
              src={primaryPreview}
              alt="Primary"
              className="h-full w-full object-cover"
            />
            {primaryUploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 size={20} className="animate-spin text-blue-500" />
              </div>
            )}
            {primaryError && (
              <div className="absolute inset-0 bg-red-50/80 flex flex-col items-center justify-center gap-1 p-2">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-xs text-red-600 text-center">{primaryError}</p>
              </div>
            )}
            {!primaryUploading && (
              <button
                type="button"
                onClick={clearPrimary}
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-zinc-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            )}
            {form.image_url && !primaryUploading && (
              <div className="absolute bottom-2 left-2">
                <span className="text-[10px] font-medium bg-green-500/90 text-white px-1.5 py-0.5 rounded">
                  Uploaded ✓
                </span>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => primaryRef.current?.click()}
            className="w-full border-2 border-dashed border-zinc-200 hover:border-amber-300 hover:bg-amber-50/30 rounded-xl py-8 flex flex-col items-center gap-2 text-zinc-400 hover:text-amber-500 transition-colors"
          >
            <Star size={22} />
            <span className="text-xs font-medium">Upload primary image</span>
            <span className="text-xs">PNG, JPG, WEBP up to 5MB</span>
          </button>
        )}

        <input
          ref={primaryRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            if (e.target.files[0]) handlePrimaryFile(e.target.files[0]);
            e.target.value = "";
          }}
        />

        {/* OR: paste an external URL into image_url directly */}
        <Field
          label="Or paste an external URL"
          icon={<LinkIcon size={13} className="text-zinc-400" />}
          hint="Use this if you already have a hosted image URL (Unsplash, CDN, etc.)"
        >
          <input
            type="url"
            value={form.image_url}
            onChange={e => setForm(prev => ({
              ...prev,
              image_url:       e.target.value,
              _primaryPreview: e.target.value,
            }))}
            placeholder="https://example.com/product-image.jpg"
            className={INPUT}
          />
        </Field>
      </div>

      <div className="border-t border-zinc-100" />

      {/* ══ SECTION 2: Gallery Images ══ */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Images size={14} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-zinc-800">Gallery Images</h3>
          <span className="text-xs text-zinc-400">(optional)</span>
          <span className="ml-auto text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
            Stored in <code className="font-mono">images[]</code> jsonb
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          Additional product photos shown in the image carousel on the product detail page.
        </p>

        {/* Existing gallery thumbnails */}
        {form.images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {form.images.map((img, idx) => (
              <div
                key={idx}
                className="relative h-20 w-20 rounded-lg border border-zinc-200 overflow-hidden bg-zinc-100 group"
              >
                <img
                  src={img.localPreview || img.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {img.uploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <Loader2 size={14} className="animate-spin text-blue-500" />
                  </div>
                )}
                {img.error && (
                  <div className="absolute inset-0 bg-red-50/80 flex items-center justify-center">
                    <AlertCircle size={13} className="text-red-500" />
                  </div>
                )}
                {!img.uploading && (
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-zinc-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                )}
                {img.url && !img.uploading && (
                  <div className="absolute bottom-1 left-1">
                    <span className="text-[9px] font-medium bg-green-500/80 text-white px-1 py-0.5 rounded">
                      ✓
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload zone */}
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          className="w-full border-2 border-dashed border-zinc-200 hover:border-blue-300 hover:bg-blue-50/30 rounded-xl py-6 flex flex-col items-center gap-2 text-zinc-400 hover:text-blue-500 transition-colors"
        >
          <Upload size={20} />
          <span className="text-xs font-medium">Click to upload gallery images</span>
          <span className="text-xs">PNG, JPG, WEBP up to 5MB each · Multiple allowed</span>
        </button>

        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => {
            handleGalleryFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}