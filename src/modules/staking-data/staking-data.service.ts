import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos/response.dto';
import { ErrorMap } from '../../common/error.map';
import { CommonUtil } from '../../utils/common.util';
import { StakingdataRepository } from './staking-data.repository';
import { CreateUserStakingPoolDto } from './dto/create-update-staking-pool.dto';


@Injectable()
export class StakingDataService {
    private readonly logger = new Logger(StakingDataService.name);
    private readonly commonUtil: CommonUtil = new CommonUtil();
    
    constructor(private stakingDataRepo: StakingdataRepository) {
        this.logger.log('============== Constructor User Service ==============');
    }
    
    async userStaking(stakingDto: CreateUserStakingPoolDto): Promise<ResponseDto<any>> {
        try {
        const user = await this.stakingDataRepo.userStaking(stakingDto);
        return ResponseDto.response(ErrorMap.SUCCESSFUL, user);
        } catch (error) {
        return ResponseDto.responseError(StakingDataService.name, error);
        }
    }
}
