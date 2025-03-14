import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { ArticleModule } from '../articles/article.module';
import { CommentRepository } from './repositories/comment.repository';
import { CommentService } from './services/comment.service';
import { CommentController } from './controllers/comment.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity]), ArticleModule, AuthModule],
  providers: [CommentRepository, CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
