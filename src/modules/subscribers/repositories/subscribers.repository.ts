import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SubscriberEntity } from '../entities/subscriber.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriberDto } from '../dtos/create-subscriber.dto';

@Injectable()
export class SubscriberRepository extends Repository<SubscriberEntity> {
  constructor(
    @InjectRepository(SubscriberEntity)
    private subcriberRepo: Repository<SubscriberEntity>,
  ) {
    super(
      subcriberRepo.target,
      subcriberRepo.manager,
      subcriberRepo.queryRunner,
    );
  }

  public async findAll(): Promise<SubscriberEntity[]> {
    return this.find();
  }

  public async findByEmail(email: string): Promise<SubscriberEntity | null> {
    return this.findOne({ where: { email } });
  }

  public async store(
    subscriber: CreateSubscriberDto,
  ): Promise<SubscriberEntity> {
    const newSubscriber = this.create(subscriber);
    return this.save(newSubscriber);
  }

  public async destroyByEmail(email: string): Promise<void> {
    await this.delete({ email });
  }
}
