import { AuthModule } from '@auth';
import { ArticleEntity } from '@entities';
import { SubscriberModule } from '@modules/subscribers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiModule, HtmlUtilsModule } from '@shared';

import { ArticleController } from './article.controller';
import { ArticleRepository } from './article.repository';
import { ArticleService } from './article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity]),
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
