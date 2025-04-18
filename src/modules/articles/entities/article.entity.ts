import { BaseEntity } from '@common/entities/base.entity';
import { CommentEntity } from '@modules/comments/entities/comment.entity';
import { TagEntity } from '@modules/tags/entities/tag.entity';
import { UserEntity } from '@modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

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

  @Column({ default: 0 })
  views: number;

  @ManyToOne(() => TagEntity, (tag) => tag.articles, { onDelete: 'CASCADE' })
  tag: TagEntity;

  @ManyToOne(() => UserEntity, (user) => user.articles, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.article, {
    cascade: true,
  })
  comments: CommentEntity[];
}
