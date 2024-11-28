import { BaseEntityAutoId } from '../../../common/entities';
import { Column, Entity } from 'typeorm';

@Entity('staking_data')
export class StakingDataEntity extends BaseEntityAutoId {
  @Column({ name: 'contract_address' })
  contract_address: string;

  @Column({ name: 'pool_id', type: 'uuid' })
  pool_id: string;

  @Column({ name: 'wallet' })
  wallet: string;

  @Column({ name: 'amount' })
  amount: number;

  @Column({ name: 'is_staking' })
  isStaking: boolean;

  @Column({ name: 'tx_hash' })
  tx_hash: string;
}
