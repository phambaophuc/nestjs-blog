import { TagEntity } from '@/entities';
import { ArticleMapper } from '@/modules/articles/dto';

import { TagDetailDto, TagListDto } from './tag.dto';

export class TagMapper {
  private static baseFields = (e: TagEntity) => ({
    id: e.id,
    name: e.name,
  });

  static toDetail = (e: TagEntity): TagDetailDto => ({
    ...this.baseFields(e),
    articles: ArticleMapper.toDetails(e.articles),
  });

  static toList = (e: TagEntity): TagListDto => ({
    ...this.baseFields(e),
    articles: ArticleMapper.toDetails(e.articles),
  });

  static toDetails = (entities: TagEntity[]) =>
    entities.map((e) => this.toDetail(e));

  static toLists = (entities: TagEntity[]) => entities.map(this.toList);
}
