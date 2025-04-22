import { AuthModule } from '@auth';
import { configuration, getTypeOrmConfig } from '@config';
import { ArticleModule } from '@modules/articles';
import { CommentModule } from '@modules/comments';
import { StorageModule } from '@modules/storage';
import { SubscriberModule } from '@modules/subscribers';
import { TagModule } from '@modules/tags';
import { UserModule } from '@modules/users';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
})
export class AppModule {}
