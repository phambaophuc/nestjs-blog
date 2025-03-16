import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorController } from './controllers/author.controller';
import { AuthorEntity } from './entities/author.entity';
import { AuthorRepository } from './repositories/author.repository';
import { AuthorService } from './services/author.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorEntity])],
  controllers: [AuthorController],
  providers: [AuthorRepository, AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
