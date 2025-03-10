import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/posts/post.module';
import { TagModule } from './modules/tags/tag.module';
import { AuthorModule } from './modules/authors/author.module';
import { StorageModule } from './modules/storage/storage.module';
import { SubscriberModule } from './modules/subscribers/subscriber.module';
import { CommentModule } from './modules/comments/comment.module';

@Module({
  imports: [
    DatabaseModule,
    AuthorModule,
    AuthModule,
    PostModule,
    TagModule,
    StorageModule,
    SubscriberModule,
    CommentModule,
  ],
})
export class AppModule {}
