import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos/response.dto';
import { ErrorMap } from '../../common/error.map';
import { UserRepository } from './user.repository';
import { CommonUtil } from '../../utils/common.util';
import { ReferUserDto } from './dto/request/refer-user.dto';
import { StakingDataRepository } from '../../modules/staking-data/staking-data.repository';
import axios from 'axios';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(
    private userRepo: UserRepository,
    private stakingDataRepo: StakingDataRepository,
  ) {
    this.logger.log('============== Constructor User Service ==============');
  }

  async getUserInfoByAddress(address: string): Promise<ResponseDto<any>> {
    try {
      let user: any = await this.userRepo.initUser(address);

      const stakingData = await this.userRepo.getUserStaking(
        address,
      );

      user.rank = stakingData[0]?.stake_rank || null;
      user.friendRefer = stakingData[0]?.friend || 0;
      user.totalFriendStaked = stakingData[0]?.child_staked || 0;

      if (user.referredBy) {
        const referer = await this.userRepo.repo.findOne({
          where: { id: user.referredBy },
        });

        user.referredBy = referer.wallet;
      }
      return ResponseDto.response(ErrorMap.SUCCESSFUL, user);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }

  async referUser(dto: ReferUserDto): Promise<ResponseDto<any>> {
    try {
      const referer = await this.userRepo.repo.findOne({
        where: { referralCode: dto.referralCode },
      });

      if (!referer) {
        return ResponseDto.responseError(
          UserService.name,
          'Invalid referral code',
        );
      }

      const user = await this.userRepo.initUser(dto.addr);

      if (user.id === referer.id) {
        return ResponseDto.responseError(
          UserService.name,
          'Cannot refer yourself',
        );
      }
      user.referredBy = referer.id;
      await this.userRepo.repo.save(user);

      return ResponseDto.response(ErrorMap.SUCCESSFUL);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }

  async getFrensPrice(): Promise<ResponseDto<any>> {
    try {
      const result = await axios.get('https://contract-openapi.weex.com/api/spot/v1/market/ticker?symbol=FRENSUSDT_SPBL');
      return ResponseDto.response(ErrorMap.SUCCESSFUL, result.data.data);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }
}
