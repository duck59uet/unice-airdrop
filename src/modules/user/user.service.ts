import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos/response.dto';
import { ErrorMap } from '../../common/error.map';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { CommonUtil } from '../../utils/common.util';
import { ReferUserDto } from './dto/request/refer-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(private userRepo: UserRepository) {
    this.logger.log('============== Constructor User Service ==============');
  }

  async getUserInfoByAddress(address: string): Promise<ResponseDto<any>> {
    try {
      const user = await this.userRepo.initUser(address);

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
      user.referredBy = referer.id;
      await this.userRepo.repo.save(user);

      return ResponseDto.response(ErrorMap.SUCCESSFUL);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }
}
