import { ArticleEntity } from '@modules/articles/entities/article.entity';
import { CommentEntity } from '@modules/comments/entities/comment.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('authors')
export class AuthorEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  displayName: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];
}
