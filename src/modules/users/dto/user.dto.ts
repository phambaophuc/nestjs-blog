import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsUrl, IsUUID } from 'class-validator';

import { ArticleDetailDto } from '@/modules/articles/dto';

class UserBaseDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  createdAt: Date;
}

export class UserDetailDto extends UserBaseDto {
  @ApiPropertyOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ type: () => [ArticleDetailDto] })
  articles?: ArticleDetailDto[];

  @ApiPropertyOptional()
  refreshToken: string | null;
}

export class UserListDto extends UserBaseDto {
  @ApiPropertyOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ type: () => [ArticleDetailDto] })
  articles?: ArticleDetailDto[];
}

export class UserInternalDto extends UserDetailDto {
  password: string;
}

export class CreateUserDto {
  displayName: string;
  email: string;
  password: string;
  avatarUrl?: string;
}
