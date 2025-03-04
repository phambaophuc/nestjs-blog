import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriberEntity } from './entities/subscriber.entity';
import { SubscriberRepository } from './repositories/subscribers.repository';
import { SubscribersService } from './services/subscribers.service';
import { SubscriberController } from './controllers/subscriber.controller';
import { EmailModule } from 'src/utils/nodemailer/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriberEntity]), EmailModule],
  providers: [SubscriberRepository, SubscribersService],
  controllers: [SubscriberController],
  exports: [SubscribersService],
})
export class SubscriberModule {}
