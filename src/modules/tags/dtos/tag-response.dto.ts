import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '../entities/tag.entity';

export class TagResponseDto {
  @ApiProperty({ example: 'tag-1' })
  id: string;

  @ApiProperty({ example: 'NestJS' })
  name: string;

  static fromEntity(tag: Tag): TagResponseDto {
    return {
      id: tag.id,
      name: tag.name,
    };
  }

  static fromEntities(tags: Tag[]): TagResponseDto[] {
    return tags.map((tag) => TagResponseDto.fromEntity(tag));
  }
}
