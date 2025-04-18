import { DatabaseModule } from '@config/database.module';
import { ArticleModule } from '@modules/articles/article.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CommentModule } from '@modules/comments/comment.module';
import { NotificationModule } from '@modules/notifications/notification.module';
import { StorageModule } from '@modules/storage/storage.module';
import { SubscriberModule } from '@modules/subscribers/subscriber.module';
import { TagModule } from '@modules/tags/tag.module';
import { UserModule } from '@modules/users/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    ArticleModule,
    TagModule,
    StorageModule,
    SubscriberModule,
    CommentModule,
    NotificationModule,
  ],
})
export class AppModule {}
