import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Tag, (tag) => tag.posts, { onDelete: 'CASCADE' })
  tag: Tag;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;
}
