
'use client'
import { useState, useRef } from 'react'
import { Upload, Trash2, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ImageUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef()

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    const urls = []
    for (const file of files) {
      const path = `temp/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('product-images').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    onChange([...images, ...urls])
    setUploading(false)
  }

  const remove = (i) => onChange(images.filter((_, idx) => idx !== i))
  const makePrimary = (i) => {
    const next = [...images]
    const [item] = next.splice(i, 1)
    onChange([item, ...next])  // first image = primary
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3">
        {images.map((url, i) => (
          <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
            <img src={url} alt="" className="w-full h-full object-cover" />
            {i === 0 && (
              <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                Primary
              </span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              {i !== 0 && (
                <button onClick={() => makePrimary(i)} className="p-1.5 bg-white rounded-lg text-blue-600 hover:bg-blue-50">
                  <Star size={13} />
                </button>
              )}
              <button onClick={() => remove(i)} className="p-1.5 bg-white rounded-lg text-red-600 hover:bg-red-50">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => inputRef.current.click()}
          disabled={uploading}
          className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50 transition text-gray-400 disabled:opacity-50"
        >
          <Upload size={18} />
          <span className="text-xs">{uploading ? 'Uploading...' : 'Upload'}</span>
        </button>
      </div>
      <p className="text-xs text-gray-400">First image = primary. Hover to set primary or remove.</p>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={handleUpload} />
    </div>
  )
}
