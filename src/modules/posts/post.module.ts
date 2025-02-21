import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TagModule } from '../tags/tag.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), TagModule, AuthModule],
  providers: [PostRepository, PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
