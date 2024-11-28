import { Body, Controller, Logger, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CONTROLLER_CONSTANTS,
  URL_CONSTANTS,
} from '../../common/constants/api.constant';
import { CommonGet, CommonPost } from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos/response.dto';
import { UserService } from './user.service';
import { ReferUserDto } from './dto/request/refer-user.dto';

@Controller(CONTROLLER_CONSTANTS.USER)
@ApiTags(CONTROLLER_CONSTANTS.USER)
export class UserController {
  public readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}


  @CommonGet({
    url: URL_CONSTANTS.ADDRESS,
    summary: 'Get user info',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'User detail',
      schema: {},
    },
  })
  async getUserInfoByAddress(@Param('address') address: string) {
    this.logger.log('========== Get user info ==========');
    return this.userService.getUserInfoByAddress(address);
  }

  @CommonPost({
    url: URL_CONSTANTS.REFFERAL,
    summary: 'Refer user',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Refer user',
      schema: {},
    },
  })
  async referUser(@Body() dto: ReferUserDto) {
    this.logger.log('========== Refer user ==========');
    return this.userService.referUser(dto);
  }
}
