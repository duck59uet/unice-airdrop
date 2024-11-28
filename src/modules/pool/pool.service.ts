import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos/response.dto';
import { ErrorMap } from '../../common/error.map';
import { CommonUtil } from '../../utils/common.util';
import { PoolRepository } from './pool.repository';

@Injectable()
export class PoolService {
  private readonly logger = new Logger(PoolService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(private poolRepo: PoolRepository) {
    this.logger.log('============== Constructor User Service ==============');
  }

  async getActicePools(): Promise<ResponseDto<any>> {
    try {
      const user = await this.poolRepo.repo.find({
        where: { status: 2 },
      });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, user);
    } catch (error) {
      return ResponseDto.responseError(PoolService.name, error);
    }
  }
}
