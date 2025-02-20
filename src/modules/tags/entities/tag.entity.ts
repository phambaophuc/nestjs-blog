import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Post } from 'src/modules/posts/entities/post.entity';

@Entity('tags')
export class Tag extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Post, (post) => post.tag)
  posts: Post[];
}
