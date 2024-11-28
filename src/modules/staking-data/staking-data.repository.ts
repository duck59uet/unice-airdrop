import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StakingDataEntity } from './entities/staking-data.entity';
import { CreateUserStakingPoolDto } from './dto/create-update-staking-pool.dto';


@Injectable()
export class StakingdataRepository {
  public readonly logger = new Logger(StakingdataRepository.name);

  constructor(
    @InjectRepository(StakingDataEntity)
    public repo: Repository<StakingDataEntity>,
  ) {
    this.logger.log(
      '============== Constructor Staking Data Repository ==============',
    );
  }

  async userStaking(stakingData: CreateUserStakingPoolDto): Promise<any> {
    try {
      const stakingDto = new StakingDataEntity();
      stakingDto.amount = stakingData.amount;
      stakingDto.pool_id = stakingData.pool_id;
      stakingDto.wallet = stakingData.wallet;
      stakingDto.isStaking = true;
      stakingDto.tx_hash = stakingData.tx_hash;

      return await this.repo.save(stakingDto);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
