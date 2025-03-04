import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { PostService } from './services/post.service';
import { AuthModule } from '../auth/auth.module';
import { PostController } from './controllers/post.controller';
import { PostRepository } from './repositories/post.repository';
import { SubscriberModule } from '../subscribers/subscriber.module';
import { EmailModule } from 'src/utils/nodemailer/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    AuthModule,
    SubscriberModule,
    EmailModule,
  ],
  providers: [PostRepository, PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
