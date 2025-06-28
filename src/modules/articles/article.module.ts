import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/auth';
import { ArticleEntity } from '@/entities';
import { GeminiModule, HtmlUtilsModule } from '@/shared';

import { SubscriberModule } from '../subscribers';
import { TagModule } from '../tags';
import { ArticleController } from './article.controller';
import { ArticleRepository } from './article.repository';
import { ArticleService } from './article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity]),
    TagModule,
    AuthModule,
    SubscriberModule,
    HtmlUtilsModule,
    GeminiModule,
  ],
  providers: [ArticleRepository, ArticleService],
  controllers: [ArticleController],
  exports: [ArticleService],
})
export class ArticleModule {}
