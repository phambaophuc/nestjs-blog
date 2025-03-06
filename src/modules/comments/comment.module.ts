import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { PostModule } from '../posts/post.module';
import { CommentRepository } from './repositories/comment.repository';
import { CommentService } from './services/comment.service';
import { CommentController } from './controllers/comment.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity]), PostModule, AuthModule],
  providers: [CommentRepository, CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
