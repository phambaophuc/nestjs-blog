import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { TagResponseDto } from './dtos/tag-response.dto';
import { CreateTagDto } from './dtos/create-tag.dto';

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOkResponse({ type: [TagResponseDto] })
  getAllTags(): Promise<TagResponseDto[]> {
    return this.tagService.getAllTags();
  }

  @Post()
  @ApiResponse({ status: 201, type: TagResponseDto })
  createTag(@Body() createTagDto: CreateTagDto): Promise<TagResponseDto> {
    return this.tagService.createTag(createTagDto);
  }
}
