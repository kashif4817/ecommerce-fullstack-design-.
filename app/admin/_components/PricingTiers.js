
'use client'
import { Plus, Trash2 } from 'lucide-react'

export default function PricingTiers({ tiers, onChange }) {
  const add = () => onChange([...tiers, { min_qty: '', max_qty: '', price: '' }])
  const remove = (i) => onChange(tiers.filter((_, idx) => idx !== i))
  const update = (i, key, val) => {
    const next = [...tiers]
    next[i] = { ...next[i], [key]: val }
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {tiers.length > 0 && (
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-xs text-gray-400 px-1">
          <span>Min Qty</span><span>Max Qty</span><span>Price (USD)</span><span />
        </div>
      )}
      {tiers.map((tier, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
          <input type="number" value={tier.min_qty} onChange={e => update(i, 'min_qty', e.target.value)}
            placeholder="50" className={inputCls} />
          <input type="number" value={tier.max_qty} onChange={e => update(i, 'max_qty', e.target.value)}
            placeholder="100 (blank = unlimited)" className={inputCls} />
          <input type="number" value={tier.price} onChange={e => update(i, 'price', e.target.value)}
            placeholder="98.00" step="0.01" className={inputCls} />
          <button onClick={() => remove(i)} className="p-1.5 text-gray-400 hover:text-red-500 transition">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button onClick={add}
        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition mt-1">
        <Plus size={14} /> Add tier
      </button>
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
