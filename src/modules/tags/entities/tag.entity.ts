import { BaseEntity } from '@common/entities/base.entity';
import { ArticleEntity } from '@modules/articles/entities/article.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('tags')
export class TagEntity extends BaseEntity {
  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => ArticleEntity, (article) => article.tag)
  articles: ArticleEntity[];
}
