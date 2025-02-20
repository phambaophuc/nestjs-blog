import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/posts/post.module';
import { TagModule } from './modules/tags/tag.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, PostModule, TagModule],
})
export class AppModule {}
