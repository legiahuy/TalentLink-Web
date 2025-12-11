export interface Participant {
  id: string
  odUserId?: string
  username: string
  displayName: string
  avatarUrl?: string | null
  joinedAt?: string
}

export interface Conversation {
  id: string
  name?: string
  isGroup: boolean
  createdAt: string
  updatedAt: string
  participants: Participant[]
  lastMessage?: Message
  unreadCount?: number
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName?: string
  senderAvatar?: string
  content: string
  attachmentUrl?: string
  attachmentType?: 'image' | 'video' | 'audio' | 'file'
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateConversationPayload {
  name?: string
  isGroup: boolean
  participantIds: string[]
}

export interface SendMessagePayload {
  // conversationId hoặc recipientId – ít nhất 1 field
  conversationId?: string
  recipientId?: string
  content: string
  attachmentUrl?: string
  attachmentType?: 'image' | 'video' | 'audio' | 'file'
}

export interface UpdateMessagePayload {
  content: string
}

export interface UploadResponse {
  url: string
  filename: string
  mimetype: string
  size: number
}

