
'use client'
import { Plus, Trash2 } from 'lucide-react'

export default function FeaturesEditor({ features, onChange }) {
  const add = () => onChange([...features, ''])
  const remove = (i) => onChange(features.filter((_, idx) => idx !== i))
  const update = (i, val) => {
    const next = [...features]
    next[i] = val
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {features.map((feature, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-green-500 text-sm">✓</span>
          <input value={feature} onChange={e => update(i, e.target.value)}
            placeholder="e.g. Some great feature name here" className={`flex-1 ${inputCls}`} />
          <button onClick={() => remove(i)} className="p-1.5 text-gray-400 hover:text-red-500 transition">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button onClick={add}
        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition mt-1">
        <Plus size={14} /> Add feature
      </button>
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
