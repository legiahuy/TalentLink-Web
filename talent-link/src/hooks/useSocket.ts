'use client'

import { useEffect, useRef } from 'react'
import type { Message } from '@/types/message'
import { useSocketContext } from '@/context/SocketContext'

interface UseSocketOptions {
  onNewMessage?: (message: Message) => void
  onMessageRead?: (data: { messageId: string; userId: string }) => void
  onTyping?: (data: { conversationId: string; userId: string; isTyping: boolean }) => void
  onUserOnline?: (userId: string) => void
  onUserOffline?: (userId: string) => void
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const {
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
    sendTyping,
    sendMessage,
    onlineUsers,
  } = useSocketContext()

  // Refs to keep current callbacks without triggering effect on change
  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  useEffect(() => {
    if (!socket || !isConnected) return

    // Handlers that call the latest callbacks
    const handleNewMessage = (message: Message) => {
      optionsRef.current.onNewMessage?.(message)
    }
    const handleMessageRead = (data: { messageId: string; userId: string }) => {
      optionsRef.current.onMessageRead?.(data)
    }
    const handleTyping = (data: { conversationId: string; userId: string; isTyping: boolean }) => {
      optionsRef.current.onTyping?.(data)
    }
    const handleUserOnline = (userId: string) => {
      optionsRef.current.onUserOnline?.(userId)
    }
    const handleUserOffline = (userId: string) => {
      optionsRef.current.onUserOffline?.(userId)
    }

    // Attach listeners
    // Note: We are attaching new listeners for every component using this hook.
    // Socket.IO supports multiple listeners.
    socket.on('newMessage', handleNewMessage)
    socket.on('message:new', handleNewMessage)
    socket.on('messageRead', handleMessageRead)
    socket.on('typing', handleTyping)
    socket.on('user:online', handleUserOnline)
    socket.on('user:offline', handleUserOffline)

    return () => {
      socket.off('newMessage', handleNewMessage)
      socket.off('message:new', handleNewMessage)
      socket.off('messageRead', handleMessageRead)
      socket.off('typing', handleTyping)
      socket.off('user:online', handleUserOnline)
      socket.off('user:offline', handleUserOffline)
    }
  }, [socket, isConnected])

  return {
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
    sendTyping,
    sendMessage,
    onlineUsers,
  }
}


