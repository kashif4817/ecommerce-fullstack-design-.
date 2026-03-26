"use client";

/* ─────────────────────────────────────────────────────────────
   CartPage  (/cart/page.jsx)
   Fully dynamic — reads from CartContext, no dummy data.
   Real-time: qty changes, remove, save for later, clear all.
───────────────────────────────────────────────────────────── */

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Trash2, Bookmark, ShoppingCart,
  Lock, Headphones, Truck, ChevronDown,
  ChevronUp, ImageOff, PackageOpen,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";

/* ── helper — same as everywhere ── */
const getThumb = (item) => item.image_url || item.images?.[0] || null;

/* ── Payment Icons ── */
function PaymentIcons() {
  return (
    <div className="flex items-center justify-center gap-2 mt-3">
      <div className="h-6 px-2 flex items-center justify-center border border-gray-200 rounded bg-white">
        <span className="text-[11px] font-extrabold text-blue-800 tracking-tight italic">VISA</span>
      </div>
      <div className="h-6 px-1.5 flex items-center justify-center border border-gray-200 rounded bg-white">
        <div className="relative flex items-center w-6 h-4">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500 absolute left-0" />
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 absolute left-2 opacity-90" />
        </div>
      </div>
      <div className="h-6 px-2 flex items-center justify-center border border-gray-200 rounded bg-white">
        <span className="text-[10px] font-extrabold text-blue-500">Pay</span>
        <span className="text-[10px] font-extrabold text-blue-900">Pal</span>
      </div>
      <div className="h-6 px-2 flex items-center justify-center border border-gray-200 rounded bg-blue-600">
        <span className="text-[9px] font-bold text-white tracking-wide">AMEX</span>
      </div>
      <div className="h-6 px-2 flex items-center justify-center border border-gray-200 rounded bg-black">
        <span className="text-[10px] font-semibold text-white"> Pay</span>
      </div>
    </div>
  );
}

/* ── Cart Item Row ── */
function CartItem({ item, onRemove, onSaveForLater, onQtyChange }) {
  const thumb = getThumb(item);

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Thumbnail */}
      <div className="w-[72px] h-[72px] shrink-0 rounded border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
        {thumb ? (
          <img src={thumb} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <ImageOff size={20} className="text-gray-300" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.id}`}
          className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors leading-snug line-clamp-2"
        >
          {item.name}
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">ID: {item.id.slice(0, 8)}…</p>

        {/* Actions */}
        <div className="flex gap-2 mt-2.5">
          <button
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-1 text-xs text-red-500 border border-red-300 hover:bg-red-50 px-2.5 py-1 rounded transition-colors"
          >
            <Trash2 size={11} />
            Remove
          </button>
          <button
            onClick={() => onSaveForLater(item)}
            className="flex items-center gap-1 text-xs text-blue-500 border border-blue-300 hover:bg-blue-50 px-2.5 py-1 rounded transition-colors"
          >
            <Bookmark size={11} />
            Save for later
          </button>
        </div>
      </div>

      {/* Price + Qty */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-sm font-bold text-gray-900">
          ${(Number(item.base_price) * item.qty).toFixed(2)}
        </span>
        <span className="text-xs text-gray-400">
          ${Number(item.base_price).toFixed(2)} each
        </span>

        {/* Qty stepper */}
        <div className="flex items-center border border-gray-300 rounded overflow-hidden">
          <button
            onClick={() => onQtyChange(item.id, item.qty - 1)}
            className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 border-r border-gray-300 transition-colors"
          >
            <ChevronDown size={13} className="text-gray-500" />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-gray-700 select-none">
            {item.qty}
          </span>
          <button
            onClick={() => onQtyChange(item.id, item.qty + 1)}
            className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 border-l border-gray-300 transition-colors"
          >
            <ChevronUp size={13} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Saved For Later Card ── */
function SavedCard({ item, onMoveToCart, onRemove }) {
  const thumb = getThumb(item);
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {thumb ? (
          <img src={thumb} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <ImageOff size={28} className="text-gray-300" />
        )}
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-sm font-bold text-gray-900">
          ${Number(item.base_price).toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 leading-snug line-clamp-2">{item.name}</p>
        <div className="mt-auto pt-2 flex gap-2">
          <button
            onClick={() => onMoveToCart(item)}
            className="flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:underline"
          >
            <ShoppingCart size={12} />
            Move to cart
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:underline ml-auto"
          >
            <Trash2 size={11} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, addItem, subtotal } = useCart();
  const [coupon, setCoupon]           = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [savedItems, setSavedItems]   = useState([]);

  /* ── discount + tax logic ── */
  const discount    = couponApplied ? subtotal * 0.1 : 0;   // 10% coupon
  const tax         = subtotal * 0.05;                       // 5% tax
  const total       = subtotal - discount + tax;

  /* ── handlers ── */
  const handleSaveForLater = (item) => {
    removeItem(item.id);
    setSavedItems(prev =>
      prev.find(i => i.id === item.id) ? prev : [...prev, item]
    );
  };

  const handleMoveToCart = (item) => {
    addItem(item, 1);
    setSavedItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleRemoveSaved = (id) => {
    setSavedItems(prev => prev.filter(i => i.id !== id));
  };

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SAVE10") {
      setCouponApplied(true);
    }
  };

  /* ════════════════ RENDER ════════════════════════════════ */
  return (
    <>
      <Navbar hideSearch />

      <main className="bg-gray-100 min-h-screen py-6">
        <div className="max-w-6xl mx-auto px-4">

          <h1 className="text-xl font-bold text-gray-800 mb-4">
            My cart ({items.length} item{items.length !== 1 ? "s" : ""})
          </h1>

          {/* ── Cart + Summary Row ── */}
          <div className="flex flex-col lg:flex-row gap-5">

            {/* LEFT — cart items */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm p-4">

                {items.length === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
                    <PackageOpen size={44} className="opacity-30" />
                    <p className="text-sm font-medium text-gray-500">Your cart is empty</p>
                    <Link
                      href="/"
                      className="mt-1 text-sm text-blue-500 hover:underline font-medium"
                    >
                      Continue shopping →
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={removeItem}
                      onSaveForLater={handleSaveForLater}
                      onQtyChange={updateQty}
                    />
                  ))
                )}

                {items.length > 0 && (
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <Link
                      href="/"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                    >
                      <ArrowLeft size={15} />
                      Back to shop
                    </Link>
                    <button
                      onClick={clearCart}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Remove all
                    </button>
                  </div>
                )}
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: <Lock size={22} className="text-gray-500" />,       title: "Secure payment",   sub: "Your payment info is safe" },
                  { icon: <Headphones size={22} className="text-gray-500" />, title: "Customer support", sub: "24/7 support available"      },
                  { icon: <Truck size={22} className="text-gray-500" />,      title: "Free delivery",    sub: "On orders over $100"         },
                ].map((b, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">{b.icon}</div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{b.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{b.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Order summary */}
            <div className="w-full lg:w-72 shrink-0 space-y-4">

              {/* Coupon */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-2">Have a coupon?</p>
                {couponApplied ? (
                  <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                    ✓ Coupon <strong>SAVE10</strong> applied — 10% off!
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Try SAVE10"
                      className="flex-1 text-xs border border-gray-200 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="text-xs bg-white border border-blue-500 text-blue-600 font-semibold px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items):
                    </span>
                    <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Discount (10%):</span>
                      <span className="font-medium text-red-500">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax (5%):</span>
                    <span className="font-medium text-green-600">+${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2.5 border-t border-gray-100">
                    <span className="font-bold text-gray-800 text-base">Total:</span>
                    <span className="font-bold text-gray-900 text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  disabled={items.length === 0}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-sm"
                >
                  Checkout
                </button>

                <PaymentIcons />
              </div>
            </div>
          </div>

          {/* ── Saved for Later ── */}
          {savedItems.length > 0 && (
            <div className="mt-8">
              <h2 className="text-base font-bold text-gray-800 mb-4">
                Saved for later ({savedItems.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {savedItems.map((item) => (
                  <SavedCard
                    key={item.id}
                    item={item}
                    onMoveToCart={handleMoveToCart}
                    onRemove={handleRemoveSaved}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Promo Banner ── */}
          <div className="mt-6 rounded-xl overflow-hidden flex items-stretch min-h-[80px]">
            <div className="flex-1 bg-blue-900 flex flex-col justify-center px-6 py-5">
              <p className="text-white font-bold text-base leading-snug">
                Super discount on more than 100 USD
              </p>
              <p className="text-blue-300 text-xs mt-1">
                Use code <strong className="text-white">SAVE10</strong> at checkout for 10% off
              </p>
            </div>
            <div className="bg-blue-500 flex items-center justify-center px-8">
              <Link
                href="/"
                className="bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors whitespace-nowrap shadow"
              >
                Shop now
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}