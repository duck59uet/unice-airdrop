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

  async userStaking(
    stakingData: CreateUserStakingPoolDto,
    referBy: string,
  ): Promise<any> {
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
    const sql = `WITH ranked_staking AS (
    SELECT
        "staking_data"."wallet",
        SUM("staking_data"."amount") AS total_staked,
        RANK() OVER (ORDER BY SUM("staking_data"."amount") DESC) AS rank
    FROM
        "staking_data"
    WHERE
        "staking_data"."deletedAt" IS NULL
    GROUP BY
        "staking_data"."wallet"
    )
SELECT
    rs.total_staked,
    rs.rank,
    COALESCE(SUM("sd_ref"."amount"), 0) AS total_amount_referrer
FROM
    ranked_staking rs
INNER JOIN
    "users" "user" ON "user"."wallet" = rs."wallet" AND "user"."deletedAt" IS NULL
LEFT JOIN
    "staking_data" "sd_ref" ON "sd_ref"."wallet" = rs."wallet" AND "sd_ref"."deletedAt" IS NULL
LEFT JOIN
    "users" "user_ref" ON "user_ref"."wallet" = "sd_ref"."wallet" AND "user_ref"."deletedAt" IS NULL
WHERE
    rs."wallet" = '${wallet}'
GROUP BY
    rs."wallet", rs.total_staked, rs.rank;`;

    return this.repo.query(sql);
  }
}
