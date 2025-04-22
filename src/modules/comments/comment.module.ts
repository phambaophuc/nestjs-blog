import { AuthModule } from '@auth';
import { CommentEntity } from '@entities';
import { ArticleModule } from '@modules/articles';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    ArticleModule,
    AuthModule,
  ],
  providers: [CommentRepository, CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
