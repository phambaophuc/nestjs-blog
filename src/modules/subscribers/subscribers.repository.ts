import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubscriberEntity } from '@/entities';

import { CreateSubscriberDto } from './dto';

@Injectable()
export class SubscriberRepository {
  constructor(
    @InjectRepository(SubscriberEntity)
    private repo: Repository<SubscriberEntity>,
  ) {}

  async findAll(): Promise<SubscriberEntity[]> {
    return this.repo.find();
  }

  async findByEmail(email: string): Promise<SubscriberEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  async store(subscriber: CreateSubscriberDto): Promise<SubscriberEntity> {
    const newSubscriber = this.repo.create(subscriber);
    return this.repo.save(newSubscriber);
  }

  async destroyByEmail(email: string): Promise<void> {
    await this.repo.delete({ email });
  }
}
