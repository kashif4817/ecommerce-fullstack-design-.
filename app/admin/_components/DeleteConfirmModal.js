import { AlertTriangle } from "lucide-react";

export default function DeleteConfirmModal({
  item,
  product,
  itemName,
  title = "Delete Item",
  description,
  confirmLabel = "Delete",
  savingLabel = "Deleting...",
  saving = false,
  onConfirm,
  onClose,
}) {
  const targetName = itemName || item?.name || product?.name || "this item";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-red-50 p-2">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="mb-6 text-sm text-gray-500">
          {description ?? (
            <>
              Are you sure you want to delete <strong>{targetName}</strong>?
              {" "}This cannot be undone.
            </>
          )}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? savingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
