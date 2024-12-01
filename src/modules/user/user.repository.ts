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
      `WITH user_data AS (
    SELECT 
        u.wallet AS self, 
        COALESCE(SUM(ssd.amount), 0) AS self_stake, 
        SUM(sd.amount) AS child_staked, 
        COUNT(DISTINCT ref.id) AS friend
    FROM 
        users u
    LEFT JOIN 
        users ref ON u.id = ref."referredBy"
    LEFT JOIN 
        staking_data sd ON ref.wallet = sd.wallet
    LEFT JOIN 
        staking_data ssd ON u.wallet = ssd.wallet
    GROUP BY 
        u.wallet
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
      `WITH user_data AS (
    SELECT 
        u.wallet AS self, 
        COALESCE(SUM(ssd.amount), 0) AS self_stake, 
        SUM(sd.amount) AS child_staked, 
        COUNT(DISTINCT ref.id) AS friend
    FROM 
        users u
    LEFT JOIN 
        users ref ON u.id = ref."referredBy"
    LEFT JOIN 
        staking_data sd ON ref.wallet = sd.wallet
    LEFT JOIN 
        staking_data ssd ON u.wallet = ssd.wallet
    GROUP BY 
        u.wallet
),
ranked_data AS (
    SELECT 
        self, 
        child_staked, 
        friend,
        RANK() OVER (ORDER BY child_staked DESC) as rank
    FROM 
        user_data
    WHERE
        child_staked > 0
)
SELECT 
    self, 
    child_staked, 
    friend, 
    rank
FROM 
    ranked_data`,
    );
  }
}
