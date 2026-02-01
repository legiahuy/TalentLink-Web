'use client'

import { SocketProvider } from '@/context/SocketContext'

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SocketProvider>{children}</SocketProvider>
}
