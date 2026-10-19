import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Toast.css'

export interface ToastData {
  id: number
  message: string
  link?: { to: string; label: string }
  action?: { label: string; onClick: () => void }
}

export default function Toast({ toast, onClose }: { toast: ToastData | null; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(onClose, 4500)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          <span>{toast.message}</span>
          {toast.link && (
            <Link to={toast.link.to} onClick={onClose}>
              {toast.link.label}
            </Link>
          )}
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick()
                onClose()
              }}
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
