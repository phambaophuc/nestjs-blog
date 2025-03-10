import { CommentEntity } from 'src/modules/comments/entities/comment.entity';
import { PostEntity } from 'src/modules/posts/entities/post.entity';
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

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];
}
