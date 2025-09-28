"use client"

import {
  ToastProvider as RadixToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast"
import { ToastManagerProvider, useToast } from "@/components/ui/use-toast"

function ToastList() {
  const { toasts, remove } = useToast()
  return (
    <>
      {toasts.map((t) => (
        <Toast key={t.id} variant={t.variant} onOpenChange={(open) => !open && remove(t.id)}>
          {t.title && <ToastTitle>{t.title}</ToastTitle>}
          {t.description && (
            <ToastDescription>{t.description}</ToastDescription>
          )}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </>
  )
}

export function Toaster() {
  return (
    <ToastManagerProvider>
      <RadixToastProvider>
        <ToastList />
      </RadixToastProvider>
    </ToastManagerProvider>
  )
}

