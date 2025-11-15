import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiveSession, SessionType, SessionStatus } from '../../entities/live-session.entity';

@Injectable()
export class LiveServicesService {
  constructor(
    @InjectRepository(LiveSession)
    private sessionRepository: Repository<LiveSession>,
  ) {}

  async requestSession(
    userId: string,
    expertId: string,
    type: SessionType,
    topic: string,
    preferredDateTime?: Date,
  ): Promise<LiveSession> {
    const session = this.sessionRepository.create({
      userId,
      expertId,
      type,
      topic,
      preferredDateTime,
      status: SessionStatus.REQUESTED,
    });

    return await this.sessionRepository.save(session);
  }

  async scheduleSession(
    sessionId: string,
    scheduledDateTime: Date,
    durationMinutes: number,
    price?: number,
  ): Promise<LiveSession> {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });

    if (!session) {
      throw new Error('Session not found');
    }

    session.status = SessionStatus.SCHEDULED;
    session.scheduledDateTime = scheduledDateTime;
    session.durationMinutes = durationMinutes;
    session.price = price;

    return await this.sessionRepository.save(session);
  }

  async startSession(sessionId: string, meetingLink: string): Promise<LiveSession> {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });

    if (!session) {
      throw new Error('Session not found');
    }

    session.status = SessionStatus.IN_PROGRESS;
    session.meetingLink = meetingLink;

    return await this.sessionRepository.save(session);
  }

  async completeSession(sessionId: string, expertNotes?: string): Promise<LiveSession> {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });

    if (!session) {
      throw new Error('Session not found');
    }

    session.status = SessionStatus.COMPLETED;
    session.completedAt = new Date();
    session.expertNotes = expertNotes;

    return await this.sessionRepository.save(session);
  }

  async cancelSession(sessionId: string): Promise<LiveSession> {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });

    if (!session) {
      throw new Error('Session not found');
    }

    session.status = SessionStatus.CANCELLED;

    return await this.sessionRepository.save(session);
  }

  async rateSession(sessionId: string, rating: number, review: string): Promise<LiveSession> {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });

    if (!session) {
      throw new Error('Session not found');
    }

    session.rating = rating;
    session.review = review;

    return await this.sessionRepository.save(session);
  }

  async getUserSessions(userId: string): Promise<LiveSession[]> {
    return await this.sessionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getExpertSessions(expertId: string): Promise<LiveSession[]> {
    return await this.sessionRepository.find({
      where: { expertId },
      order: { createdAt: 'DESC' },
    });
  }

  async getSession(sessionId: string): Promise<LiveSession | null> {
    return await this.sessionRepository.findOne({ where: { id: sessionId } });
  }
}
