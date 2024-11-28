import { Body, Controller, Logger, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CONTROLLER_CONSTANTS,
  URL_CONSTANTS,
} from '../../common/constants/api.constant';
import { CommonPost } from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos/response.dto';
import { StakingDataService } from './staking-data.service';
import { CreateUserStakingPoolDto } from './dto/create-update-staking-pool.dto';

@Controller(CONTROLLER_CONSTANTS.STAKING_DATA)
@ApiTags(CONTROLLER_CONSTANTS.STAKING_DATA)
export class StakingDataController {
  public readonly logger = new Logger(StakingDataController.name);

  constructor(private stakingDataService: StakingDataService) {}

  @CommonPost({
    url: '',
    summary: 'User staking',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'User staking',
      schema: {},
    },
  })
  async userStaking(@Body() stakingDto: CreateUserStakingPoolDto) {
    this.logger.log('========== User staking ==========');
    return this.stakingDataService.userStaking(stakingDto);
  }
}
