import { Column, Entity, Index, OneToMany } from 'typeorm';

import { ArticleEntity } from './article.entity';
import { BaseEntity } from './base.entity';
import { CommentEntity } from './comment.entity';

@Entity('users')
@Index(['email'])
export class UserEntity extends BaseEntity {
  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  displayName: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];
}
