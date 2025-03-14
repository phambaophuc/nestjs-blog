import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TagModule } from './modules/tags/tag.module';
import { AuthorModule } from './modules/authors/author.module';
import { StorageModule } from './modules/storage/storage.module';
import { SubscriberModule } from './modules/subscribers/subscriber.module';
import { CommentModule } from './modules/comments/comment.module';
import { ArticleModule } from './modules/articles/article.module';

@Module({
  imports: [
    DatabaseModule,
    AuthorModule,
    AuthModule,
    ArticleModule,
    TagModule,
    StorageModule,
    SubscriberModule,
    CommentModule,
  ],
})
export class AppModule {}
