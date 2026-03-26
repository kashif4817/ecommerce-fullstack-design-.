
import { Pencil, Trash2, Star } from 'lucide-react'

export default function ProductsTable({ products, isPending, onEdit, onDelete }) {
  if (!products.length) {
    return (
      <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl">
        No products found. Add your first product.
      </div>
    )
  }

  return (
    <div className={`rounded-xl border border-gray-200 overflow-hidden transition-opacity ${isPending ? 'opacity-50' : ''}`}>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Product</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Price</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Stock</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Flags</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Rating</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {products.map((product) => {
            const primaryImage = product.product_images?.find(i => i.is_primary)
              || product.product_images?.[0]
            return (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {primaryImage ? (
                        <img src={primaryImage.image_url} alt={product.name}
                          className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.suppliers?.name || '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {product.categories?.name || '—'}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">${product.base_price}</p>
                  {product.original_price && (
                    <p className="text-xs text-gray-400 line-through">${product.original_price}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    product.is_in_stock
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-600'
                  }`}>
                    {product.is_in_stock ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {product.is_featured && <Badge color="blue">Featured</Badge>}
                    {product.is_deal && <Badge color="orange">Deal</Badge>}
                    {product.is_recommended && <Badge color="purple">Recommended</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {product.rating > 0 && (
                    <span className="flex items-center gap-1 text-amber-500 text-xs">
                      <Star size={12} fill="currentColor" />
                      {product.rating} ({product.review_count})
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Badge({ color, children }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    orange: 'bg-orange-50 text-orange-700',
    purple: 'bg-purple-50 text-purple-700',
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}