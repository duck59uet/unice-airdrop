import { Column, Entity } from 'typeorm';
import { BaseEntityAutoId } from '../../../common/entities';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends BaseEntityAutoId {
  @Column({ unique: true, nullable: false })
  wallet: string;

  @Column({ nullable: true, type: 'bigint' })
  @Exclude()
  nonce: number;

  @Column({ nullable: true })
  referralCode: string;

  @Column({ nullable: true, type: 'uuid' })
  referredBy: string;
}
