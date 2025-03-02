import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { TagResponseDto } from '../dtos/tag-response.dto';
import { TagService } from '../services/tag.service';

@ApiTags('TagController')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOkResponse({ type: [TagResponseDto] })
  public async findAll(): Promise<TagResponseDto[]> {
    return this.tagService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: TagResponseDto })
  public async findById(@Param() id: string): Promise<TagResponseDto> {
    return this.tagService.findById(id);
  }

  @Post()
  @ApiResponse({ status: 201, type: TagResponseDto })
  public async create(
    @Body() createTagDto: CreateTagDto,
  ): Promise<TagResponseDto> {
    return this.tagService.create(createTagDto);
  }

  @Delete(':id')
  public async delete(@Res() response: Response, @Param() id: string) {
    await this.tagService.delete(id);
    return response.status(HttpStatus.OK).json({
      message: 'Tag has been deleted successfully',
    });
  }
}
