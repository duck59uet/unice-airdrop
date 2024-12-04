import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import * as randomstring from 'randomstring';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  public readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    public repo: Repository<User>,
  ) {
    this.logger.log(
      '============== Constructor User Repository ==============',
    );
  }

  /**
   * getUsers
   * @param limit
   * @param skip
   * @returns
   */
  getUsers(limit: number, skip: number): Promise<User[]> {
    return this.repo.find({
      take: limit,
      skip,
    });
  }

  async getUserByAddress(address: string): Promise<User> {
    const qb = this.repo
      .createQueryBuilder('users')
      .where({
        deletedAt: IsNull(),
      })
      .andWhere(`users.wallet ilike :addr`, {
        addr: address,
      });

    return qb.getOne();
  }

  async initUser(addr: string): Promise<User> {
    let user = await this.getUserByAddress(addr);

    if (user !== null) return user;

    const referralCode = randomstring.generate(7);
    user = new User();
    user.referralCode = referralCode.toUpperCase();
    user.wallet = addr;
    return await this.repo.save(user);
  }

  async getUserStaking(address: string): Promise<any> {
    return this.repo.query(
      `WITH aggregated_stakes AS (
    SELECT
        wallet,
        SUM(amount) AS total_stake
    FROM
        staking_data
    GROUP BY
        wallet
),
user_data AS (
    SELECT
        u.wallet AS self,
        COALESCE(ssd.total_stake, 0) AS self_stake,
        COALESCE(SUM(asd.total_stake), 0) AS child_staked,
        COUNT(DISTINCT ref.id) AS friend
    FROM
        users u
    LEFT JOIN
        users ref ON u.id = ref."referredBy"
    LEFT JOIN
        aggregated_stakes asd ON ref.wallet = asd.wallet
    LEFT JOIN
        aggregated_stakes ssd ON u.wallet = ssd.wallet
    GROUP BY
        u.wallet, ssd.total_stake
),
ranked_data AS (
    SELECT
        self,
        self_stake,
        child_staked,
        friend,
        -- Chỉ tính rank cho những user có self_stake > 0
        CASE
            WHEN self_stake > 0 THEN RANK() OVER (ORDER BY self_stake DESC)
            ELSE NULL
        END AS stake_rank
    FROM
        user_data
)
SELECT
    self,
    child_staked,
    friend,
    self_stake,
    stake_rank
FROM
    ranked_data
WHERE
    self = $1`,
      [address],
    );
  }

  async getLeaderboard(): Promise<any> {
    return this.repo.query(
      `WITH aggregated_stakes AS (
    SELECT
        wallet,
        SUM(amount) AS total_stake
    FROM
        staking_data
    GROUP BY
        wallet
),
user_data AS (
    SELECT
        u.wallet AS self,
        COALESCE(ssd.total_stake, 0) AS self_stake,
        COALESCE(SUM(asd.total_stake), 0) AS child_staked,
        COUNT(DISTINCT ref.id) AS friend
    FROM
        users u
    LEFT JOIN
        users ref ON u.id = ref."referredBy"
    LEFT JOIN
        aggregated_stakes asd ON ref.wallet = asd.wallet
    LEFT JOIN
        aggregated_stakes ssd ON u.wallet = ssd.wallet
    GROUP BY
        u.wallet, ssd.total_stake
),
ranked_data AS (
    SELECT
        self,
        self_stake,
        child_staked,
        friend,
        -- Chỉ tính rank cho những user có self_stake > 0
        CASE
            WHEN child_staked > 0 THEN RANK() OVER (ORDER BY child_staked DESC)
            ELSE NULL
        END AS stake_rank
    FROM
        user_data
)
SELECT
    self,
    child_staked,
    friend,
    self_stake,
    stake_rank
FROM
    ranked_data
WHERE
    child_staked > 0
ORDER BY
    stake_rank ASC`,
    );
  }
}
