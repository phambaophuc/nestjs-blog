import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TagEntity } from '../../tags/entities/tag.entity';
import { AuthorEntity } from 'src/modules/authors/entities/author.entity';
import { CommentEntity } from 'src/modules/comments/entities/comment.entity';

@Entity('articles')
export class ArticleEntity extends BaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => TagEntity, (tag) => tag.articles, { onDelete: 'CASCADE' })
  tag: TagEntity;

  @ManyToOne(() => AuthorEntity, (author) => author.articles, {
    onDelete: 'CASCADE',
  })
  author: AuthorEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.article, { cascade: true })
  comments: CommentEntity[];
}
