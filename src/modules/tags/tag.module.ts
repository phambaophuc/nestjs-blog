import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagRepository, TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
