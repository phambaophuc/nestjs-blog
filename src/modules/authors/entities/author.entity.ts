import { CommentEntity } from 'src/modules/comments/entities/comment.entity';
import { ArticleEntity } from 'src/modules/articles/entities/article.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

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
