import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';
import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  providers: [TagRepository, TagService],
  controllers: [TagController],
  exports: [TagRepository],
})
export class TagModule {}
