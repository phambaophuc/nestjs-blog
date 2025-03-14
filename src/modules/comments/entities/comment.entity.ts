import { BaseEntity } from 'src/common/entities/base.entity';
import { AuthorEntity } from 'src/modules/authors/entities/author.entity';
import { ArticleEntity } from 'src/modules/articles/entities/article.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('comments')
export class CommentEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => ArticleEntity, (article) => article.comments, { onDelete: 'CASCADE' })
  article: ArticleEntity;

  @ManyToOne(() => AuthorEntity, (author) => author.comments, {
    onDelete: 'CASCADE',
  })
  author: AuthorEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: CommentEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  replies: CommentEntity[];
}
