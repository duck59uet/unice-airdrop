import { Body, Param, Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CONTROLLER_CONSTANTS } from '../../common/constants/api.constant';
import { AuthService } from './auth.service';
import { Web3LoginDTO } from './dto/web3-login.dto';

@Controller(CONTROLLER_CONSTANTS.AUTH)
@ApiTags(CONTROLLER_CONSTANTS.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user')
  @ApiOperation({
    summary: 'Send signature to check and send BNB',
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDTO: Web3LoginDTO): Promise<any> {
    await this.authService.userLogIn(loginDTO);
  }
}
