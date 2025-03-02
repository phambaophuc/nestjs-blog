import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { PostService } from './services/post.service';
import { AuthModule } from '../auth/auth.module';
import { PostController } from './controllers/post.controller';
import { PostRepository } from './repositories/post.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), AuthModule],
  providers: [PostRepository, PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
