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

import { CreateTagDto } from './dto';
import { TagDetailResponse, TagListResponse } from './dto/responses.dto';
import { TagService } from './tag.service';

@ApiTags('TagController')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOkResponse({ type: [TagListResponse] })
  public async findAll(): Promise<TagListResponse[]> {
    return this.tagService.findAll();
  }

  @Get('trending')
  @ApiOkResponse({ type: [TagListResponse] })
  public async findTrendingTags(): Promise<TagListResponse[]> {
    return this.tagService.findTrendingTags();
  }

  @Get(':id')
  @ApiOkResponse({ type: TagDetailResponse })
  public async findById(@Param('id') id: string): Promise<TagDetailResponse> {
    return this.tagService.findById(id);
  }

  @Post()
  @ApiResponse({ status: 201, type: TagDetailResponse })
  public async create(
    @Body() createTagDto: CreateTagDto,
  ): Promise<TagDetailResponse> {
    return this.tagService.create(createTagDto);
  }

  @Delete(':id')
  public async delete(@Res() response: Response, @Param('id') id: string) {
    await this.tagService.delete(id);
    return response.status(HttpStatus.OK).json({
      message: 'Tag has been deleted successfully',
    });
  }
}
