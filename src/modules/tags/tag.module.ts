import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';
import { TagController } from './controllers/tag.controller';
import { TagRepository } from './repositories/tag.repository';
import { TagService } from './services/tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  providers: [TagRepository, TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
