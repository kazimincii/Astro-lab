import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonProfile } from '@/entities/person-profile.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(PersonProfile)
    private profilesRepository: Repository<PersonProfile>,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async create(userId: string, createData: Partial<PersonProfile>) {
    const subscription = await this.subscriptionsService.ensureDefaultSubscription(userId);
    const currentProfiles = await this.profilesRepository.count({
      where: { owner: { id: userId } },
    });

    if (!subscription.unlimitedActions && currentProfiles >= subscription.profileLimit) {
      throw new BadRequestException(
        'Profile limit reached for your current membership plan. Upgrade to add more profiles.',
      );
    }

    const profile = this.profilesRepository.create({
      ...createData,
      owner: { id: userId } as any,
    });
    return this.profilesRepository.save(profile);
  }

  async findAll(userId: string) {
    return this.profilesRepository.find({
      where: { owner: { id: userId } },
      order: { isMainProfile: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.profilesRepository.findOne({
      where: { id, owner: { id: userId } },
    });
  }

  async update(id: string, userId: string, updateData: Partial<PersonProfile>) {
    await this.profilesRepository.update(
      { id, owner: { id: userId } },
      updateData,
    );
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string) {
    await this.profilesRepository.delete({ id, owner: { id: userId } });
    return { message: 'Profile deleted successfully' };
  }
}
