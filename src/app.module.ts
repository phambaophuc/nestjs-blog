import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/posts/post.module';
import { TagModule } from './modules/tags/tag.module';
import { AuthorModule } from './modules/authors/author.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    DatabaseModule,
    AuthorModule,
    AuthModule,
    PostModule,
    TagModule,
    StorageModule,
  ],
})
export class AppModule {}
