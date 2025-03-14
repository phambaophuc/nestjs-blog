import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { ArticleService } from './services/article.service';
import { AuthModule } from '../auth/auth.module';
import { ArticleController } from './controllers/article.controller';
import { ArticleRepository } from './repositories/article.repository';
import { SubscriberModule } from '../subscribers/subscriber.module';
import { EmailModule } from 'src/utils/nodemailer/email.module';

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
