'use client'

import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/stores/authStore'
import type { Message } from '@/types/message'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://talentlink.io.vn'

interface UseSocketOptions {
  onNewMessage?: (message: Message) => void
  onMessageRead?: (data: { messageId: string; userId: string }) => void
  onTyping?: (data: { conversationId: string; userId: string; isTyping: boolean }) => void
  onUserOnline?: (userId: string) => void
  onUserOffline?: (userId: string) => void
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const socketRef = useRef<Socket | null>(null)
  const { accessToken, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Frontend chỉ dùng socket để NHẬN realtime (newMessage, typing, online/offline)
    // và gửi các tín hiệu như joinConversation / typing.
    // Tin nhắn thực tế được gửi qua REST API, backend sẽ tự emit sự kiện qua socket.
    if (!isAuthenticated || !accessToken) return

    // Connect to socket server
    socketRef.current = io(SOCKET_URL, {
      // Đường dẫn socket, cần khớp với backend (thường là '/socket.io')
      path: '/socket.io',
      // Token gửi qua auth (backend có thể đọc từ đây)
      auth: {
        token: accessToken,
      },
      // Gửi kèm token qua query để tương thích với cấu hình backend/gateway hiện tại
      query: {
        token: accessToken,
      },
      // Cho phép cả websocket (ưu tiên) và polling nếu backend hỗ trợ
      transports: ['websocket', 'polling'],
      // Auto reconnect
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      // Timeout
      timeout: 20000,
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id)
      console.log('📡 Socket URL:', SOCKET_URL)
      console.log('🔗 Socket transport:', socket.io.engine.transport.name)
    })

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts')
    })

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Attempting to reconnect...', attemptNumber)
    })

    socket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error)
    })

    socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed after all attempts')
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason)
      // Tự động reconnect nếu disconnect không chủ ý
      if (reason === 'io server disconnect') {
        // Server disconnect, cần reconnect thủ công
        socket.connect()
      }
    })

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message)
    })

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })

    // Debug: Log tất cả events để kiểm tra
    socket.onAny((eventName, ...args) => {
      console.log('🔔 Socket event received:', eventName, args)
    })

    // Listen for new messages - thử nhiều event names phổ biến
    if (options.onNewMessage) {
      // Event name chính
      socket.on('newMessage', options.onNewMessage)
      // Các event names khác có thể backend dùng
      socket.on('message', options.onNewMessage)
      socket.on('message:new', options.onNewMessage)
      socket.on('message:created', options.onNewMessage)
    }

    // Listen for message read events
    if (options.onMessageRead) {
      socket.on('messageRead', options.onMessageRead)
    }

    // Listen for typing events
    if (options.onTyping) {
      socket.on('typing', options.onTyping)
    }

    // Listen for user online/offline
    if (options.onUserOnline) {
      socket.on('userOnline', options.onUserOnline)
    }
    if (options.onUserOffline) {
      socket.on('userOffline', options.onUserOffline)
    }

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [isAuthenticated, accessToken])

  // Join a conversation room
  const joinConversation = useCallback((conversationId: string) => {
    if (!socketRef.current?.connected) {
      console.warn('⚠️ Socket chưa kết nối, không thể join conversation:', conversationId)
      return
    }
    console.log('🚪 Joining conversation:', conversationId)
    socketRef.current.emit('joinConversation', conversationId)
  }, [])

  // Leave a conversation room
  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('leaveConversation', conversationId)
  }, [])

  // Send typing indicator
  const sendTyping = useCallback((conversationId: string, isTyping: boolean) => {
    socketRef.current?.emit('typing', { conversationId, isTyping })
  }, [])

  // Send message via socket (optional - can also use REST API)
  const sendMessage = useCallback(
    (conversationId: string, content: string, attachmentUrl?: string, attachmentType?: string) => {
      socketRef.current?.emit('sendMessage', {
        conversationId,
        content,
        attachmentUrl,
        attachmentType,
      })
    },
    [],
  )

  return {
    socket: socketRef.current,
    joinConversation,
    leaveConversation,
    sendTyping,
    sendMessage,
  }
}

