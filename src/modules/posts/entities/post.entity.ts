import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TagEntity } from '../../tags/entities/tag.entity';
import { AuthorEntity } from 'src/modules/authors/entities/author.entity';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => TagEntity, (tag) => tag.posts, { onDelete: 'CASCADE' })
  tag: TagEntity;

  @ManyToOne(() => AuthorEntity, (author) => author.posts, {
    onDelete: 'CASCADE',
  })
  author: AuthorEntity;
}
