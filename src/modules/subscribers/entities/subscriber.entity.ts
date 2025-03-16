import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('subscribers')
export class SubscriberEntity extends BaseEntity {
  @Column({ unique: true, nullable: false })
  email: string;
}
