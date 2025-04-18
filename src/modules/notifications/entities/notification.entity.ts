import { BaseEntity } from '@common/entities/base.entity';
import { UserEntity } from '@modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export type NotificationType = 'comment' | 'like' | 'system';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'text' })
  type: NotificationType;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
