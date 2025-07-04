import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth';
import { configuration, getTypeOrmConfig } from './config';
import { ArticleModule } from './modules/articles';
import { CommentModule } from './modules/comments';
import { CrawlerModule } from './modules/crawler';
import { RssModule } from './modules/rss';
import { StorageModule } from './modules/storage';
import { SubscriberModule } from './modules/subscribers';
import { TagModule } from './modules/tags';
import { UserModule } from './modules/users';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    AuthModule,
    ArticleModule,
    CommentModule,
    StorageModule,
    SubscriberModule,
    TagModule,
    UserModule,
    RssModule,
    CrawlerModule,
  ],
})
export class AppModule {}
