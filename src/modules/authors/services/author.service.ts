import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthorResponseDto } from '../dtos/author-response.dto';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { AuthorRepository } from '../repositories/author.repository';

@Injectable()
export class AuthorService {
  constructor(private readonly authorRepository: AuthorRepository) {}

  async findAll(): Promise<AuthorResponseDto[]> {
    try {
      const authors = await this.authorRepository.findAll();
      return AuthorResponseDto.fromEntities(authors);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<AuthorResponseDto> {
    try {
      const author = await this.authorRepository.findById(id);
      if (!author) {
        throw new NotFoundException('Author not found.');
      }
      return AuthorResponseDto.fromEntity(author);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByEmail(email: string): Promise<AuthorResponseDto> {
    try {
      const author = await this.authorRepository.findByEmail(email);
      if (!author) {
        throw new NotFoundException('Author not found.');
      }
      return AuthorResponseDto.fromEntity(author);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(author: CreateAuthorDto): Promise<AuthorResponseDto> {
    try {
      const newAuthor = await this.authorRepository.store(author);
      return AuthorResponseDto.fromEntity(newAuthor);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.authorRepository.destroy(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
