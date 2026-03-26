"use client";

/* ─────────────────────────────────────────────────────────────
   ProductDetailPage  (/products/[id]/page.jsx)
   – Add to Cart  → adds to CartContext, stays on page
   – Buy Now      → adds to CartContext, redirects to /cart
───────────────────────────────────────────────────────────── */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import CategoryBar from "@/components/layout/CategoryBar";
import Footer from "@/components/layout/Footer";
import Newsletter from "@/components/layout/NewsLetter";
import Link from "next/link";
import {
  Heart, CheckCircle, ShieldCheck, Globe,
  Loader2, ImageOff, ShoppingCart, Zap,
  Plus, Minus, Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

/* ── helpers ── */
const getThumb = (product) =>
  product.image_url || product.images?.[0] || null;

/* ── Star Rating ── */
function StarRating({ rating }) {
  const stars = Math.round((rating ?? 0) / 2);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24"
          fill={s <= stars ? "#FF9017" : "none"}
          stroke={s <= stars ? "#FF9017" : "#ccc"} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function ProductDetailPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const { addItem, isInCart, totalCount } = useCart();

  const [product,       setProduct]       = useState(null);
  const [youMayLike,    setYouMayLike]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [notFound,      setNotFound]      = useState(false);
  const [activeImage,   setActiveImage]   = useState(0);
  const [activeTab,     setActiveTab]     = useState("Description");
  const [savedForLater, setSavedForLater] = useState(false);
  const [qty,           setQty]           = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false); // brief ✓ flash

  const tabs = ["Description", "Reviews", "Shipping", "About seller"];

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);

      const { data: prod, error } = await supabase
        .from("products")
        .select(`
          id, name, slug, description,
          base_price, original_price,
          product_type, material, design,
          customization, protection, warranty,
          price_negotiable, stock, is_in_stock,
          units_sold, is_featured, is_deal, is_recommended,
          rating, review_count,
          image_url, images,
          category_id,
          categories ( id, name )
        `)
        .eq("id", id)
        .single();

      if (error || !prod) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProduct(prod);
      setActiveImage(0);

      if (prod.category_id) {
        const { data: related } = await supabase
          .from("products")
          .select("id, name, base_price, image_url, images")
          .eq("category_id", prod.category_id)
          .neq("id", prod.id)
          .limit(6);
        setYouMayLike(related || []);
      }

      setLoading(false);
    };
    load();
  }, [id]);

  /* ── Cart actions ── */
  const handleAddToCart = () => {
    addItem(product, qty);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, qty);
    router.push("/cart");
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <CategoryBar />
        <div className="flex-1 flex items-center justify-center text-zinc-400">
          <Loader2 size={28} className="animate-spin mr-2" />
          Loading product...
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Not found ── */
  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <CategoryBar />
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-3">
          <ImageOff size={40} className="opacity-30" />
          <p className="text-sm font-medium">Product not found</p>
          <Link href="/" className="text-sm text-blue-500 hover:underline">← Back to home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Build gallery ── */
  const gallery = (() => {
    const list = [];
    if (product.image_url) list.push(product.image_url);
    if (Array.isArray(product.images)) {
      product.images.forEach((url) => {
        if (url && url !== product.image_url) list.push(url);
      });
    }
    return list.length > 0 ? list : null;
  })();

  /* ── Details table ── */
  const details = {
    ...(product.base_price    && { Price: product.price_negotiable ? "Negotiable" : `$${Number(product.base_price).toFixed(2)}` }),
    ...(product.product_type  && { Type: product.product_type }),
    ...(product.material      && { Material: product.material }),
    ...(product.design        && { Design: product.design }),
    ...(product.customization && { Customization: product.customization }),
    ...(product.protection    && { Protection: product.protection }),
    ...(product.warranty      && { Warranty: product.warranty }),
  };

  const alreadyInCart = isInCart(product.id);

  /* ════════════════ RENDER ══════════════════════════════ */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <CategoryBar />

      <main className="flex-1 py-6">
        <div className="max-w-[1180px] mx-auto px-4">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-blue-500">Home</Link>
            <span>›</span>
            {product.categories && (
              <>
                <Link href={`/products?category=${product.category_id}`} className="hover:text-blue-500">
                  {product.categories.name}
                </Link>
                <span>›</span>
              </>
            )}
            <span className="text-blue-500 truncate max-w-[300px]">{product.name}</span>
          </nav>

          {/* ── Top card ── */}
          <div className="bg-white border border-[#DEE2E7] rounded-xl p-6 flex gap-6 mb-6">

            {/* Images column */}
            <div className="flex flex-col gap-3 shrink-0">
              <div className="w-[280px] h-[280px] border border-[#DEE2E7] rounded-xl overflow-hidden flex items-center justify-center bg-gray-50">
                {gallery ? (
                  <img
                    src={gallery[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageOff size={40} className="text-gray-300" />
                )}
              </div>

              {gallery && gallery.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-[52px] h-[52px] rounded-lg border-2 overflow-hidden transition-colors ${
                        activeImage === i ? "border-blue-500" : "border-[#DEE2E7]"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex-1 min-w-0">
              {/* Stock status */}
              <div className={`flex items-center gap-1.5 text-sm mb-2 ${
                product.is_in_stock ? "text-green-500" : "text-red-400"
              }`}>
                <CheckCircle size={15} />
                <span>{product.is_in_stock ? "In stock" : "Out of stock"}</span>
                {product.stock !== null && (
                  <span className="text-gray-400 text-xs ml-1">({product.stock} available)</span>
                )}
              </div>

              <h1 className="text-xl font-semibold text-gray-900 mb-3">{product.name}</h1>

              {/* Rating row */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <StarRating rating={product.rating} />
                <span className="text-sm text-gray-500">{product.rating ?? 0}</span>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">{product.review_count ?? 0} reviews</span>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">{product.units_sold ?? 0} sold</span>
              </div>

              {/* Pricing tiers */}
              <div className="flex gap-0 mb-5 border border-[#DEE2E7] rounded-lg overflow-hidden w-fit">
                {[
                  { label: `$${Number(product.base_price).toFixed(2)}`,                sublabel: "50–100 pcs",  highlight: true  },
                  { label: `$${(Number(product.base_price) * 0.92).toFixed(2)}`,       sublabel: "100–700 pcs", highlight: false },
                  { label: `$${(Number(product.base_price) * 0.85).toFixed(2)}`,       sublabel: "700+ pcs",    highlight: false },
                ].map((tier, i) => (
                  <div
                    key={i}
                    className={`px-5 py-2.5 text-center border-r border-[#DEE2E7] last:border-r-0 ${
                      tier.highlight ? "bg-orange-50" : "bg-white"
                    }`}
                  >
                    <p className={`font-bold text-sm ${tier.highlight ? "text-orange-500" : "text-gray-800"}`}>
                      {tier.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{tier.sublabel}</p>
                  </div>
                ))}
              </div>

              {/* Details table */}
              {Object.keys(details).length > 0 && (
                <table className="w-full text-sm mb-4">
                  <tbody>
                    {Object.entries(details).map(([key, val]) => (
                      <tr key={key} className="border-b border-gray-100">
                        <td className="py-2 text-gray-400 w-[140px]">{key}</td>
                        <td className="py-2 text-gray-700">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* ── Quantity selector ── */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-gray-500">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors border-r border-gray-200"
                  >
                    <Minus size={14} className="text-gray-600" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-gray-800">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-200"
                  >
                    <Plus size={14} className="text-gray-600" />
                  </button>
                </div>
                {product.stock !== null && (
                  <span className="text-xs text-gray-400">{product.stock} available</span>
                )}
              </div>

              {/* ── CTA Buttons ── */}
              <div className="flex items-center gap-3 flex-wrap">

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.is_in_stock}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all ${
                    addedFeedback
                      ? "bg-green-500 border-green-500 text-white"
                      : alreadyInCart
                      ? "bg-blue-50 border-blue-500 text-blue-600 hover:bg-blue-100"
                      : "bg-white border-blue-500 text-blue-600 hover:bg-blue-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {addedFeedback ? (
                    <><Check size={16} /> Added!</>
                  ) : alreadyInCart ? (
                    <><ShoppingCart size={16} /> Add more</>
                  ) : (
                    <><ShoppingCart size={16} /> Add to cart</>
                  )}
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={!product.is_in_stock}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap size={16} />
                  Buy now
                </button>

                {/* Save / wishlist */}
                <button
                  onClick={() => setSavedForLater(!savedForLater)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border transition-colors ${
                    savedForLater
                      ? "border-blue-300 text-blue-500 bg-blue-50"
                      : "border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-500"
                  }`}
                >
                  <Heart
                    size={16}
                    fill={savedForLater ? "#3b82f6" : "none"}
                    stroke={savedForLater ? "#3b82f6" : "currentColor"}
                  />
                  {savedForLater ? "Saved" : "Save"}
                </button>
              </div>

              {/* Already in cart notice */}
              {alreadyInCart && !addedFeedback && (
                <p className="text-xs text-blue-500 mt-2 flex items-center gap-1">
                  <ShoppingCart size={12} />
                  This item is already in your cart.{" "}
                  <Link href="/cart" className="underline font-medium">View cart →</Link>
                </p>
              )}
            </div>

            {/* Supplier card */}
            <div className="w-[200px] shrink-0">
              <div className="border border-[#DEE2E7] rounded-xl p-4 mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    S
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Supplier</p>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">Verified Seller</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck size={14} className="text-blue-500" />
                    <span>Verified Seller</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Globe size={14} className="text-blue-500" />
                    <span>Worldwide shipping</span>
                  </div>
                </div>

                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors mb-2">
                  Send inquiry
                </button>
                <button className="w-full border border-blue-500 text-blue-500 text-sm font-medium py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
                  Seller's profile
                </button>
              </div>
            </div>
          </div>

          {/* ── Bottom: tabs + you may like ── */}
          <div className="flex gap-6">

            {/* Tabs */}
            <div className="flex-1 min-w-0 bg-white border border-[#DEE2E7] rounded-xl overflow-hidden">
              <div className="flex border-b border-[#DEE2E7]">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-500"
                        : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "Description" && (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description || "No description available."}
                  </p>
                )}
                {activeTab === "Reviews" && (
                  <p className="text-sm text-gray-500">
                    {product.review_count > 0
                      ? `${product.review_count} reviews — coming soon.`
                      : "No reviews yet."}
                  </p>
                )}
                {activeTab === "Shipping" && (
                  <p className="text-sm text-gray-500">Worldwide shipping available. Delivery in 7–14 business days.</p>
                )}
                {activeTab === "About seller" && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-semibold text-gray-800">Verified Seller</p>
                    <p className="flex items-center gap-1 text-gray-500">
                      <Globe size={13} /> Worldwide shipping
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* You may like */}
            <div className="w-[200px] shrink-0">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">You may like</h3>
              {youMayLike.length === 0 ? (
                <p className="text-xs text-gray-400">No related products found.</p>
              ) : (
                <div className="space-y-3">
                  {youMayLike.map((item) => {
                    const thumb = getThumb(item);
                    return (
                      <Link
                        key={item.id}
                        href={`/products/${item.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-[60px] h-[60px] shrink-0 rounded-lg border border-[#DEE2E7] overflow-hidden bg-white flex items-center justify-center">
                          {thumb ? (
                            <img src={thumb} alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <ImageOff size={16} className="text-gray-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-700 group-hover:text-blue-500 transition-colors line-clamp-2 leading-snug">
                            {item.name}
                          </p>
                          <p className="text-xs text-blue-500 font-medium mt-1">
                            ${Number(item.base_price).toFixed(2)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}