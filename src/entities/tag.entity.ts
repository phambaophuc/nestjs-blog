import { Column, Entity, Index, ManyToMany } from 'typeorm';

import { ArticleEntity } from './article.entity';
import { BaseEntity } from './base.entity';

@Entity('tags')
@Index(['name'])
export class TagEntity extends BaseEntity {
  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToMany(() => ArticleEntity, (article) => article.tags)
  articles: ArticleEntity[];
}
