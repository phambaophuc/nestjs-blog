import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity('subscribers')
export class SubscriberEntity extends BaseEntity {
  @Column({ unique: true, nullable: false })
  email: string;
}
