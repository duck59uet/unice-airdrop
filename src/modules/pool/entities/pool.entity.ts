import { BaseEntityAutoId } from '../../../common/entities';
import { Column, Entity } from 'typeorm';

@Entity('staking_pools')
export class StakingPoolEntity extends BaseEntityAutoId {
  @Column({ name: 'pool_name' })
  pool_name: string;

  @Column({ name: 'start_at', type: 'timestamp' })
  start_at: Date;

  @Column({ name: 'close_at', type: 'timestamp' })
  close_at: Date;

  @Column({ nullable: true, type: 'jsonb' })
  est_apr: object;

  @Column({ name: 'staking_cap' })
  staking_cap: number;

  @Column({ name: 'token_name' })
  token_name: string;

  @Column({ name: 'token_address' })
  token_address: string;

  @Column({ name: 'status' })
  status: number;

  @Column({ name: 'contract_address' })
  contract_address: string;

  @Column({ name: 'pool_index' })
  pool_index: number;
}
