import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StakingDataEntity } from './entities/staking-data.entity';
import { CreateUserStakingPoolDto } from './dto/create-update-staking-pool.dto';
import { User } from '../../modules/user/entities/user.entity';

@Injectable()
export class StakingDataRepository {
  public readonly logger = new Logger(StakingDataRepository.name);

  constructor(
    @InjectRepository(StakingDataEntity)
    public repo: Repository<StakingDataEntity>,
  ) {
    this.logger.log(
      '============== Constructor Staking Data Repository ==============',
    );
  }

  async userStaking(stakingData: CreateUserStakingPoolDto, referBy: string): Promise<any> {
    try {
      const stakingDto = new StakingDataEntity();
      stakingDto.amount = stakingData.amount;
      stakingDto.pool_id = stakingData.pool_id;
      stakingDto.wallet = stakingData.wallet;
      stakingDto.isStaking = true;
      stakingDto.tx_hash = stakingData.tx_hash;
      stakingDto.referredBy = referBy;

      return await this.repo.save(stakingDto);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getUserStakingData(wallet: string): Promise<any> {
    return await this.repo
      .createQueryBuilder('staking_data')
      .innerJoin(User, 'user', 'user.wallet = staking_data.wallet')
      .leftJoin(StakingDataEntity, 'sd_ref', 'sd_ref.referredBy = user.wallet')
      .where('staking_data.wallet = :wallet', { wallet })
      .select([
        'sum(staking_data.amount) as total_staked',
        'RANK() OVER (ORDER BY sum(staking_data.amount) DESC) AS rank',
        'COALESCE(SUM(sd_ref.amount), 0) AS total_amount_referrer'
      ])
      .groupBy('user.wallet')
      .execute();
  }
}
