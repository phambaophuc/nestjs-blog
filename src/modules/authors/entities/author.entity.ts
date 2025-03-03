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
}
