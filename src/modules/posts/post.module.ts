import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AuthModule } from '../auth/auth.module';
import { TagModule } from '../tags/tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), AuthModule, TagModule],
  providers: [PostRepository, PostService],
  controllers: [PostController],
  exports: [PostRepository],
})
export class PostModule {}
