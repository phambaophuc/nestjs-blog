import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { CommentEntity } from './comment.entity';
import { TagEntity } from './tag.entity';
import { UserEntity } from './user.entity';

enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('articles')
export class ArticleEntity extends BaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ unique: true, nullable: false })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt?: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  coverImageUrl?: string;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT,
  })
  status: ArticleStatus;

  @Column({ default: 0 })
  viewsCount: number;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  readingTime: number;

  @Column({ default: true })
  allowComments: boolean;

  @ManyToOne(() => UserEntity, (user) => user.articles, {
    onDelete: 'CASCADE',
  })
  author: UserEntity;

  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToMany(() => TagEntity, (tag) => tag.articles)
  @JoinTable({
    name: 'article_tags',
    joinColumn: { name: 'articleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: TagEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.article, {
    cascade: true,
  })
  comments: CommentEntity[];
}
