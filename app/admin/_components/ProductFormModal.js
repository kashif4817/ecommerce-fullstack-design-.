
'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import ImageUploader from './ImageUploader'
import PricingTiers from './PricingTiers'
import AttributesEditor from './AttributesEditor'
import FeaturesEditor from './FeaturesEditor'

const TABS = ['Basic Info', 'Pricing', 'Specs & Features', 'Images', 'Settings']

export default function ProductFormModal({ product, categories, suppliers, saving, onSave, onClose }) {
  const [activeTab, setActiveTab] = useState('Basic Info')
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category_id: product?.category_id || '',
    supplier_id: product?.supplier_id || '',
    base_price: product?.base_price || '',
    original_price: product?.original_price || '',
    product_type: product?.product_type || '',
    material: product?.material || '',
    design: product?.design || '',
    customization: product?.customization || '',
    protection: product?.protection || '',
    warranty: product?.warranty || '',
    price_negotiable: product?.price_negotiable || false,
    stock: product?.stock || '',
    is_in_stock: product?.is_in_stock ?? true,
    is_featured: product?.is_featured || false,
    is_deal: product?.is_deal || false,
    is_recommended: product?.is_recommended || false,
    pricing_tiers: product?.product_pricing_tiers || [],
    attributes: product?.product_attributes?.map(a => ({
      name: a.attribute_name, value: a.attribute_value
    })) || [],
    features: product?.product_features?.map(f => f.feature) || [],
    images: product?.product_images?.map(i => i.image_url) || [],
  })

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = () => {
    if (!form.name || !form.base_price) return alert('Name and price are required.')
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:py-8">
      <div className="my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[90vh]">

        {/* Modal Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="shrink-0 flex overflow-x-auto border-b border-gray-100 px-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 mr-6 text-sm whitespace-nowrap border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {activeTab === 'Basic Info' && (
            <>
              <Field label="Product Name *">
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Mens Long Sleeve T-shirt" className={inputCls} />
              </Field>
              <Field label="Description">
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={4} placeholder="Product description..." className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select value={form.category_id} onChange={e => set('category_id', e.target.value)} className={inputCls}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Supplier">
                  <select value={form.supplier_id} onChange={e => set('supplier_id', e.target.value)} className={inputCls}>
                    <option value="">Select supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Type">
                  <input value={form.product_type} onChange={e => set('product_type', e.target.value)}
                    placeholder="e.g. Classic shoes" className={inputCls} />
                </Field>
                <Field label="Material">
                  <input value={form.material} onChange={e => set('material', e.target.value)}
                    placeholder="e.g. Plastic material" className={inputCls} />
                </Field>
                <Field label="Design">
                  <input value={form.design} onChange={e => set('design', e.target.value)}
                    placeholder="e.g. Modern nice" className={inputCls} />
                </Field>
                <Field label="Protection">
                  <input value={form.protection} onChange={e => set('protection', e.target.value)}
                    placeholder="e.g. Refund Policy" className={inputCls} />
                </Field>
              </div>
              <Field label="Customization">
                <input value={form.customization} onChange={e => set('customization', e.target.value)}
                  placeholder="e.g. Customized logo and design custom packages" className={inputCls} />
              </Field>
              <Field label="Warranty">
                <input value={form.warranty} onChange={e => set('warranty', e.target.value)}
                  placeholder="e.g. 2 years full warranty" className={inputCls} />
              </Field>
            </>
          )}

          {activeTab === 'Pricing' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Base Price (USD) *">
                  <input type="number" value={form.base_price} onChange={e => set('base_price', e.target.value)}
                    placeholder="0.00" min="0" step="0.01" className={inputCls} />
                </Field>
                <Field label="Original Price (for strikethrough)">
                  <input type="number" value={form.original_price} onChange={e => set('original_price', e.target.value)}
                    placeholder="0.00" min="0" step="0.01" className={inputCls} />
                </Field>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="negotiable" checked={form.price_negotiable}
                  onChange={e => set('price_negotiable', e.target.checked)}
                  className="rounded border-gray-300" />
                <label htmlFor="negotiable" className="text-sm text-gray-700">Price is negotiable</label>
              </div>
              <Field label="Bulk Pricing Tiers">
                <PricingTiers tiers={form.pricing_tiers} onChange={v => set('pricing_tiers', v)} />
              </Field>
            </>
          )}

          {activeTab === 'Specs & Features' && (
            <>
              <Field label="Specifications (shown in specs table)">
                <AttributesEditor attributes={form.attributes} onChange={v => set('attributes', v)} />
              </Field>
              <Field label="Features (shown as checklist)">
                <FeaturesEditor features={form.features} onChange={v => set('features', v)} />
              </Field>
            </>
          )}

          {activeTab === 'Images' && (
            <Field label="Product Images">
              <ImageUploader images={form.images} onChange={v => set('images', v)} />
            </Field>
          )}

          {activeTab === 'Settings' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Stock Quantity">
                  <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)}
                    placeholder="0" min="0" className={inputCls} />
                </Field>
              </div>
              <div className="space-y-3 mt-2">
                {[
                  { key: 'is_in_stock', label: 'In Stock', desc: 'Show "In Stock" badge on product page' },
                  { key: 'is_featured', label: 'Featured', desc: 'Show on homepage hero/featured section' },
                  { key: 'is_deal', label: 'Deal / Hot Offer', desc: 'Show in Deals section' },
                  { key: 'is_recommended', label: 'Recommended', desc: 'Show in Recommended Items section' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <input type="checkbox" id={key} checked={form[key]}
                      onChange={e => set(key, e.target.checked)}
                      className="mt-0.5 rounded border-gray-300" />
                    <div>
                      <label htmlFor={key} className="text-sm font-medium text-gray-800 cursor-pointer">{label}</label>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {saving ? 'Saving...' : product ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
