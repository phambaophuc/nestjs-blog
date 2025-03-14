import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ArticleEntity } from 'src/modules/articles/entities/article.entity';

@Entity('tags')
export class TagEntity extends BaseEntity {
  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => ArticleEntity, (article) => article.tag)
  articles: ArticleEntity[];
}
