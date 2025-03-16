import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthorResponseDto } from '../dtos/author-response.dto';
import { AuthorService } from '../services/author.service';

@ApiTags('AuthorController')
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  @ApiOkResponse({ type: [AuthorResponseDto] })
  public async findAll(): Promise<AuthorResponseDto[]> {
    return this.authorService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: AuthorResponseDto })
  public async findById(@Param('id') id: string): Promise<AuthorResponseDto> {
    return this.authorService.findById(id);
  }

  @Delete(':id')
  public async delete(@Res() response: Response, @Param('id') id: string) {
    await this.authorService.delete(id);
    return response.status(HttpStatus.OK).json({
      message: 'Author has been deleted successfully',
    });
  }
}
