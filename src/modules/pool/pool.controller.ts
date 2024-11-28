import { Controller, Logger, Param } from '@nestjs/common';
import { PoolService } from './pool.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CONTROLLER_CONSTANTS,
  URL_CONSTANTS,
} from '../../common/constants/api.constant';
import { CommonGet } from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos/response.dto';

@Controller(CONTROLLER_CONSTANTS.POOL)
@ApiTags(CONTROLLER_CONSTANTS.POOL)
export class PoolController {
  public readonly logger = new Logger(PoolController.name);

  constructor(private poolService: PoolService) {}

  @CommonGet({
    url: '',
    summary: 'Get active pools',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Get active pools',
      schema: {},
    },
  })
  async getActivePools() {
    this.logger.log('========== Get active pools ==========');
    return this.poolService.getActicePools();
  }
}
