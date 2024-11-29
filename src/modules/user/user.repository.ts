import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import * as randomstring from 'randomstring';
import { User } from './entities/user.entity';
import { StakingDataEntity } from '../../modules/staking-data/entities/staking-data.entity';

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
    return this.repo.query(`WITH ranked_staking AS (
    SELECT
        "staking_data"."wallet",
        RANK() OVER (ORDER BY SUM("staking_data"."amount") DESC) AS rank
    FROM
        "staking_data"
    WHERE
        "staking_data"."deletedAt" IS NULL
    GROUP BY
        "staking_data"."wallet"
    )
SELECT
    rs.rank,
    COUNT(DISTINCT ref.id) as total_referrer,
    SUM(sd.amount) as total_staked
FROM ranked_staking rs inner join users u on rs.wallet = u.wallet
left join users ref on u.id = ref."referredBy"
left join staking_data sd on ref.wallet = sd.wallet
where rs.wallet = '${address}'
group by rs.wallet, rs.rank`);
  }
}
