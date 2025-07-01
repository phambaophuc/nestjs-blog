import { UserEntity } from '@/entities';
import { ArticleMapper } from '@/modules/articles/dto';

import { UserDetailDto, UserInternalDto, UserListDto } from './user.dto';

export class UserMapper {
  private static baseFields = (e: UserEntity) => ({
    id: e.id,
    displayName: e.displayName,
    email: e.email,
  });

  private static publicFields = (e: UserEntity) => ({
    ...this.baseFields(e),
    avatarUrl: e.avatarUrl,
    createdAt: e.createdAt,
  });

  static toDetail = (e: UserEntity): UserDetailDto => ({
    ...this.publicFields(e),
    refreshToken: e.refreshToken,
    articles: e.articles ? ArticleMapper.toDetails(e.articles) : [],
  });

  static toList = (e: UserEntity): UserListDto => ({
    ...this.publicFields(e),
    articles: e.articles ? ArticleMapper.toDetails(e.articles) : [],
  });

  static toInternal = (e: UserEntity): UserInternalDto => ({
    ...this.toDetail(e),
    password: e.password,
  });

  static toDetails = (entities: UserEntity[]) => entities.map(this.toDetail);
  static toLists = (entities: UserEntity[]) => entities.map(this.toList);
}
