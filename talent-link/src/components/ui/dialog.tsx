"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  children: React.ReactNode
}) {
  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn"
          onClick={() => onOpenChange(false)}
        >
          {children}
        </div>
      ) : null}
    </>
  )
}

export function DialogContent({
  children,
  className,
  onClose,
}: {
  children: React.ReactNode
  className?: string
  onClose?: () => void
}) {
  return (
    <div
      className={cn(
        "bg-background rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-slideUp",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      )}
      {children}
    </div>
  )
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold">{children}</h2>
}
