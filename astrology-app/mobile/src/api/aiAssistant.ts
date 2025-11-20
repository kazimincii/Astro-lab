import { apiClient } from './client';

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  userMessage: string;
  aiResponse: string;
  createdAt: string;
}

export interface CreateConversationRequest {
  title?: string;
}

export interface SendMessageRequest {
  conversationId: string;
  message: string;
}

export const aiAssistantApi = {
  /**
   * Create a new AI conversation
   */
  createConversation: async (
    title?: string,
  ): Promise<AIConversation> => {
    const response = await apiClient.post('/ai-assistant/conversation', {
      title: title || 'New Conversation',
    });
    return response.data;
  },

  /**
   * Send a message to AI assistant and get response
   */
  sendMessage: async (
    conversationId: string,
    message: string,
  ): Promise<AIMessage> => {
    const response = await apiClient.post('/ai-assistant/message', {
      conversationId,
      message,
    });
    return response.data;
  },
};
