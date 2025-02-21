import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { TagResponseDto } from './dtos/tag-response.dto';

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOkResponse({ type: [TagResponseDto] })
  getAllTags(): Promise<TagResponseDto[]> {
    return this.tagService.getAllTags();
  }
}
