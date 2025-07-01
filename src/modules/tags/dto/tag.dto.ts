import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { ArticleDetailDto } from '@/modules/articles/dto';

class TagBaseDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  name: string;
}

export class TagDetailDto extends TagBaseDto {
  @ApiProperty({ type: () => [ArticleDetailDto] })
  articles: ArticleDetailDto[];
}

export class TagListDto extends TagBaseDto {
  @ApiProperty({ type: () => [ArticleDetailDto] })
  articles: ArticleDetailDto[];
}

export class CreateTagDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
