import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateUserStakingPoolDto {
  @ApiProperty({ required: true })
  pool_id: string;

  @ApiProperty({ required: true })
  @IsString()
  wallet: string;

  @ApiProperty({ required: true })
  @IsNumber()
  amount: number;

  @ApiProperty({ required: true })
  @IsString()
  tx_hash: string;
}