import axiosClient from '@/api/axios'
import type {
  Conversation,
  Message,
  CreateConversationPayload,
  SendMessagePayload,
  UpdateMessagePayload,
  UploadResponse,
} from '@/types/message'

export const messageService = {
  // Conversations
  getConversations: async (): Promise<Conversation[]> => {
    const res = await axiosClient.get('/conversations')
    return res.data.data || res.data
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const res = await axiosClient.get(`/conversations/${id}`)
    return res.data.data || res.data
  },

  createConversation: async (payload: CreateConversationPayload): Promise<Conversation> => {
    const res = await axiosClient.post('/conversations', payload)
    return res.data.data || res.data
  },

  updateConversation: async (
    id: string,
    payload: { name?: string; participantIds?: string[] },
  ): Promise<Conversation> => {
    const res = await axiosClient.put(`/conversations/${id}`, payload)
    return res.data.data || res.data
  },

  deleteConversation: async (id: string): Promise<void> => {
    await axiosClient.delete(`/conversations/${id}`)
  },

  addParticipants: async (id: string, participantIds: string[]): Promise<void> => {
    await axiosClient.post(`/conversations/${id}/participants`, { participantIds })
  },

  removeParticipant: async (conversationId: string, participantId: string): Promise<void> => {
    await axiosClient.delete(`/conversations/${conversationId}/participants/${participantId}`)
  },

  // Messages
  getMessages: async (
    conversationId: string,
    limit?: number,
    before?: string,
  ): Promise<Message[]> => {
    const params: Record<string, string | number> = {}
    if (limit) params.limit = limit
    if (before) params.before = before
    const res = await axiosClient.get(`/messages/conversation/${conversationId}`, { params })
    return res.data.data || res.data
  },

  getMessage: async (id: string): Promise<Message> => {
    const res = await axiosClient.get(`/messages/${id}`)
    return res.data.data || res.data
  },

  sendMessage: async (payload: SendMessagePayload): Promise<Message> => {
    if (!payload.conversationId && !payload.recipientId) {
      throw new Error('conversationId hoặc recipientId là bắt buộc')
    }
    const res = await axiosClient.post('/messages', payload)
    return res.data.data || res.data
  },

  updateMessage: async (id: string, payload: UpdateMessagePayload): Promise<Message> => {
    const res = await axiosClient.put(`/messages/${id}`, payload)
    return res.data.data || res.data
  },

  /**
   * Xóa tin nhắn và tự động xóa file đính kèm (nếu có)
   * Backend sẽ xử lý việc xóa file ảnh/video/audio/file trên storage
   */
  deleteMessage: async (id: string): Promise<void> => {
    await axiosClient.delete(`/messages/${id}`)
  },

  markMessageAsRead: async (id: string): Promise<void> => {
    await axiosClient.post(`/messages/${id}/read`)
  },

  markConversationAsRead: async (conversationId: string): Promise<void> => {
    await axiosClient.post(`/messages/conversation/${conversationId}/read`)
  },

  getUnreadCount: async (conversationId: string): Promise<number> => {
    const res = await axiosClient.get(`/messages/conversation/${conversationId}/unread-count`)
    return res.data.data || res.data || 0
  },

  // Storage
  uploadFile: async (file: File, folder: string = 'messages'): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    const res = await axiosClient.post('/storage/upload', formData)
    return res.data.data || res.data
  },

  /**
   * Xóa file trên storage (ảnh, video, audio, file)
   * Backend sẽ xóa file khỏi server storage
   */
  deleteFile: async (fileUrl: string): Promise<void> => {
    await axiosClient.delete('/storage/delete', { data: { url: fileUrl } })
  },
}

