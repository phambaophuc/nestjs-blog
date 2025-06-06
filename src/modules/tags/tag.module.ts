import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from 'entities';

import { TagController } from './tag.controller';
import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  providers: [TagRepository, TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
