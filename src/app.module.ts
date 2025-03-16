import { DatabaseModule } from '@config/database.module';
import { ArticleModule } from '@modules/articles/article.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthorModule } from '@modules/authors/author.module';
import { CommentModule } from '@modules/comments/comment.module';
import { StorageModule } from '@modules/storage/storage.module';
import { SubscriberModule } from '@modules/subscribers/subscriber.module';
import { TagModule } from '@modules/tags/tag.module';
import { Module } from '@nestjs/common';

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
