import { BaseEntity } from 'src/common/entities/base.entity';
import { AuthorEntity } from 'src/modules/authors/entities/author.entity';
import { PostEntity } from 'src/modules/posts/entities/post.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('comments')
export class CommentEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  post: PostEntity;

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
