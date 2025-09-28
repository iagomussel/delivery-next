"use client"

import * as React from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  duration?: number
}

type Toast = ToastProps & { id: string }

type ToastContextValue = {
  toast: (props: ToastProps) => { id: string }
  remove: (id: string) => void
  toasts: Toast[]
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
)

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>")
  return ctx
}

export function ToastManagerProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const remove = React.useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const toast = React.useCallback((props: ToastProps) => {
    const id = crypto.randomUUID()
    const t: Toast = { id, duration: 3000, variant: "default", ...props }
    setToasts((prev) => [...prev, t])
    if (t.duration && t.duration > 0) {
      setTimeout(() => remove(id), t.duration)
    }
    return { id }
  }, [remove])

  return (
    <ToastContext.Provider value={{ toast, remove, toasts }}>
      {children}
    </ToastContext.Provider>
  )
}

