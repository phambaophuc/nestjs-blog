import { CommentEntity } from '@/entities';
import { UserMapper } from '@/modules/users';

import { CommentDetailDto, CommentListDto } from './comment.dto';

export class CommentMapper {
  private static baseFields = (e: CommentEntity) => ({
    id: e.id,
    content: e.content,
    createdAt: e.createdAt,
  });

  static toDetail = (e: CommentEntity): CommentDetailDto => ({
    ...this.baseFields(e),
    parentId: e.parentId,
    user: e.user ? UserMapper.toDetail(e.user) : undefined,
    replies: e.replies?.map(this.toDetail) ?? [],
  });

  static toList = (e: CommentEntity): CommentListDto => ({
    ...this.baseFields(e),
    parentId: e.parentId,
    user: e.user ? UserMapper.toDetail(e.user) : undefined,
    repliesCount: e.replies?.length ?? 0,
  });

  static toDetails = (entities: CommentEntity[]) => entities.map(this.toDetail);
  static toLists = (entities: CommentEntity[]) => entities.map(this.toList);
}
