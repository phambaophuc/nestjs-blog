import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PostEntity } from 'src/modules/posts/entities/post.entity';

@Entity('tags')
export class TagEntity extends BaseEntity {
  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => PostEntity, (post) => post.tag)
  posts: PostEntity[];
}
