import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('subscribers')
export class SubscriberEntity extends BaseEntity {
  @Column({ unique: true, nullable: false })
  email: string;
}
