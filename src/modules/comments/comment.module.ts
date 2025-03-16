import { ArticleModule } from '@modules/articles/article.module';
import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentController } from './controllers/comment.controller';
import { CommentEntity } from './entities/comment.entity';
import { CommentRepository } from './repositories/comment.repository';
import { CommentService } from './services/comment.service';

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
