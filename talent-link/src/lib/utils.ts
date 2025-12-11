import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return ''
  try {
    const u = new URL(url)
    // Map internal MinIO host to public base URL
    if (u.hostname === 'minio' || u.hostname === 'minio.local' || u.hostname.endsWith('.minio')) {
      const base = process.env.NEXT_PUBLIC_MEDIA_BASE || process.env.NEXT_PUBLIC_API_URL || ''
      if (base) {
        const bu = new URL(base)
        // Preserve path; drop original host/port
        return `${bu.protocol}//${bu.host}${u.pathname}${u.search}`
      }
    }
    return u.toString()
  } catch {
    const base = (process.env.NEXT_PUBLIC_MEDIA_BASE || process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')
    if (!base) return url
    const cleaned = url.startsWith('/') ? url : `/${url}`
    return `${base}${cleaned}`
  }
}
