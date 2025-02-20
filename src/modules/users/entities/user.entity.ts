import { Post } from 'src/modules/posts/entities/post.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
