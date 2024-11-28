import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReferUserDto {
  @ApiProperty({ required: true })
  @IsString()
  addr: string;

  @ApiProperty({ required: false })
  @IsString()
  referralCode: string;
}
