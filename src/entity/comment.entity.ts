import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { ArticleEntity } from './article.entity';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('comments')
export class CommentEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => ArticleEntity, (article) => article.comments, {
    onDelete: 'CASCADE',
  })
  article: ArticleEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: CommentEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  replies: CommentEntity[];
}
