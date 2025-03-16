import { AuthModule } from '@modules/auth/auth.module';
import { SubscriberModule } from '@modules/subscribers/subscriber.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '@utils/nodemailer/email.module';

import { ArticleController } from './controllers/article.controller';
import { ArticleEntity } from './entities/article.entity';
import { ArticleRepository } from './repositories/article.repository';
import { ArticleService } from './services/article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity]),
    AuthModule,
    SubscriberModule,
    EmailModule,
  ],
  providers: [ArticleRepository, ArticleService],
  controllers: [ArticleController],
  exports: [ArticleService],
})
export class ArticleModule {}
