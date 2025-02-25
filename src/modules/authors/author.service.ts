import { Injectable } from '@nestjs/common';
import { AuthorResponseDto } from './dtos/author-response.dto';
import { AuthorRepository } from './author.repository';

@Injectable()
export class AuthorService {
  constructor(private readonly AuthorRepository: AuthorRepository) {}

  async getAllAuthors(): Promise<AuthorResponseDto[]> {
    const Authors = await this.AuthorRepository.findAll();
    return AuthorResponseDto.fromEntities(Authors);
  }

  async getAuthorByEmail(email: string): Promise<AuthorResponseDto> {
    const Author = await this.AuthorRepository.findByEmail(email);
    return AuthorResponseDto.fromEntity(Author);
  }
}
