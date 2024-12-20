import { BaseEntityAutoId } from '../../../common/entities';
import { Column, Entity } from 'typeorm';

@Entity('staking_data')
export class StakingDataEntity extends BaseEntityAutoId {
  @Column({ name: 'pool_id', type: 'uuid' })
  pool_id: string;

  @Column({ name: 'wallet' })
  wallet: string;

  @Column({ name: 'amount', type: 'float4', nullable: true })
  amount: number;

  @Column({ name: 'is_staking' })
  isStaking: boolean;

  @Column({ name: 'tx_hash' })
  tx_hash: string;

  @Column({ name: 'referredBy', nullable: true })
  referredBy: string;
}
