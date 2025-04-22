import { Column, Entity, OneToMany } from 'typeorm';

import { ArticleEntity } from './article.entity';
import { BaseEntity } from './base.entity';

@Entity('tags')
export class TagEntity extends BaseEntity {
  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => ArticleEntity, (article) => article.tag)
  articles: ArticleEntity[];
}
