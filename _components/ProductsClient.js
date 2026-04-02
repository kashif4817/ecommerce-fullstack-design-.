
'use client'
import { useState, useTransition, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import ProductsTable from './ProductsTable'
import ProductFormModal from './ProductFormModal'
import DeleteConfirmModal from './DeleteConfirmModal'
import { createProduct, updateProduct, deleteProduct } from '../app/admin/_actions/productActions'
import { Search, Plus, SlidersHorizontal } from 'lucide-react'

export default function ProductsClient({
  products, categories, suppliers, totalCount, currentPage, pageSize
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [formModal, setFormModal] = useState({ open: false, product: null })
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // ─── Search & filter ──────────────────────────
  const updateParam = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page') // reset pagination on filter change
    router.push(`${pathname}?${params.toString()}`)
  }, [searchParams, pathname, router])

  const handleSearch = useDebouncedCallback(
    (term) => updateParam('search', term), 400
  )

  // ─── CRUD handlers ────────────────────────────
  const handleSave = async (formData) => {
    setSaving(true)
    setError(null)
    const result = formModal.product
      ? await updateProduct(formModal.product.id, formData)
      : await createProduct(formData)
    setSaving(false)
    if (!result.success) { setError(result.error); return }
    setFormModal({ open: false, product: null })
    startTransition(() => router.refresh())
  }

  const handleDelete = async () => {
    setSaving(true)
    const result = await deleteProduct(deleteModal.product.id)
    setSaving(false)
    if (!result.success) { setError(result.error); return }
    setDeleteModal({ open: false, product: null })
    startTransition(() => router.refresh())
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-screen-xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{totalCount} total products</p>
        </div>
        <button
          onClick={() => setFormModal({ open: true, product: null })}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-5 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            defaultValue={searchParams.get('search') || ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          defaultValue={searchParams.get('category') || ''}
          onChange={(e) => updateParam('category', e.target.value)}
          className="text-xs sm:text-sm border border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Table — with horizontal scroll on mobile */}
      <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-0 px-3 sm:px-4 lg:px-0 mb-3 sm:mb-5">
        <ProductsTable
          products={products}
          isPending={isPending}
          onEdit={(p) => setFormModal({ open: true, product: p })}
          onDelete={(p) => setDeleteModal({ open: true, product: p })}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-3 sm:mt-5 text-xs sm:text-sm text-gray-600">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => updateParam('page', String(currentPage - 1))}
              className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 text-xs sm:text-sm"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => updateParam('page', String(currentPage + 1))}
              className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 text-xs sm:text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {formModal.open && (
        <ProductFormModal
          product={formModal.product}
          categories={categories}
          suppliers={suppliers}
          saving={saving}
          onSave={handleSave}
          onClose={() => setFormModal({ open: false, product: null })}
        />
      )}

      {deleteModal.open && (
        <DeleteConfirmModal
          product={deleteModal.product}
          saving={saving}
          onConfirm={handleDelete}
          onClose={() => setDeleteModal({ open: false, product: null })}
        />
      )}
    </div>
  )
}