import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos/response.dto';
import { ErrorMap } from '../../common/error.map';
import { CommonUtil } from '../../utils/common.util';
import { StakingDataRepository } from './staking-data.repository';
import { CreateUserStakingPoolDto } from './dto/create-update-staking-pool.dto';
import { UserRepository } from '../../modules/user/user.repository';

@Injectable()
export class StakingDataService {
  private readonly logger = new Logger(StakingDataService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(
    private stakingDataRepo: StakingDataRepository,
    private userRepo: UserRepository,
  ) {
    this.logger.log('============== Constructor User Service ==============');
  }

  async userStaking(
    stakingDto: CreateUserStakingPoolDto,
  ): Promise<ResponseDto<any>> {
    try {
      const userStake = await this.userRepo.repo.findOne({
        where: { wallet: stakingDto.wallet },
      });
      const referralBy = await this.userRepo.repo.findOne({
        where: { id: userStake.referredBy },
      });
      const result = await this.stakingDataRepo.userStaking(
        stakingDto,
        referralBy.wallet,
      );
      return ResponseDto.response(ErrorMap.SUCCESSFUL, result);
    } catch (error) {
      return ResponseDto.responseError(StakingDataService.name, error);
    }
  }
}
