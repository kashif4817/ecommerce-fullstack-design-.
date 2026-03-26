
'use client'
import { Plus, Trash2 } from 'lucide-react'

export default function AttributesEditor({ attributes, onChange }) {
  const add = () => onChange([...attributes, { name: '', value: '' }])
  const remove = (i) => onChange(attributes.filter((_, idx) => idx !== i))
  const update = (i, key, val) => {
    const next = [...attributes]
    next[i] = { ...next[i], [key]: val }
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {attributes.length > 0 && (
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs text-gray-400 px-1">
          <span>Attribute</span><span>Value</span><span />
        </div>
      )}
      {attributes.map((attr, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
          <input value={attr.name} onChange={e => update(i, 'name', e.target.value)}
            placeholder="e.g. Model" className={inputCls} />
          <input value={attr.value} onChange={e => update(i, 'value', e.target.value)}
            placeholder="e.g. #8786867" className={inputCls} />
          <button onClick={() => remove(i)} className="p-1.5 text-gray-400 hover:text-red-500 transition">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button onClick={add}
        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition mt-1">
        <Plus size={14} /> Add attribute
      </button>
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
