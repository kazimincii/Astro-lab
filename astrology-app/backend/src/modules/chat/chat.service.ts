import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { ChatMessage } from '@/entities/chat-message.entity';
// import { ChatRoom } from '@/entities/chat-room.entity';

@Injectable()
export class ChatService {
  constructor(
    // @InjectRepository(ChatMessage)
    // private chatMessagesRepository: Repository<ChatMessage>,
    // @InjectRepository(ChatRoom)
    // private chatRoomsRepository: Repository<ChatRoom>,
  ) {}

  async getUserChats(userId: string): Promise<any[]> {
    // TODO: Implement database query
    // return this.chatRoomsRepository.find({
    //   where: [
    //     { user1Id: userId },
    //     { user2Id: userId },
    //   ],
    // });
    return [];
  }

  async isUserInChat(userId: string, chatId: string): Promise<boolean> {
    // TODO: Implement validation
    // const chat = await this.chatRoomsRepository.findOne({
    //   where: { id: chatId },
    // });
    // return chat?.user1Id === userId || chat?.user2Id === userId;
    return true;
  }

  async saveMessage(data: {
    chatId: string;
    senderId: string;
    content: string;
  }): Promise<any> {
    // TODO: Implement message saving
    // const message = this.chatMessagesRepository.create({
    //   chatRoomId: data.chatId,
    //   senderId: data.senderId,
    //   content: data.content,
    //   sentAt: new Date(),
    // });
    // return this.chatMessagesRepository.save(message);
    return {
      id: 'temp-id',
      ...data,
      sentAt: new Date(),
    };
  }

  async verifyToken(token: string): Promise<string | null> {
    // TODO: Implement JWT verification
    // This should use JwtService
    return null;
  }

  async getChatHistory(chatId: string, limit: number = 50): Promise<any[]> {
    // TODO: Implement chat history retrieval
    // return this.chatMessagesRepository.find({
    //   where: { chatRoomId: chatId },
    //   order: { sentAt: 'DESC' },
    //   take: limit,
    // });
    return [];
  }

  async markAsRead(chatId: string, userId: string): Promise<void> {
    // TODO: Implement mark as read
  }
}
