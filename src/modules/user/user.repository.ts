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
      `WITH user_data AS (select u.wallet as self, COALESCE(sum(ssd.amount), 0) as self_stake, sum(sd.amount) child_staked,
count(distinct ref.id) as friend from users u left join users ref on u.id = ref."referredBy"
left join staking_data sd on ref.wallet = sd.wallet
left join staking_data ssd on u.wallet = ssd.wallet
group by u.wallet, ref.wallet)
select self, child_staked, friend, self_stake,  RANK() OVER (ORDER BY self_stake DESC) AS stake_rank from user_data
where self = $1`,
      [address],
    );
  }
}
