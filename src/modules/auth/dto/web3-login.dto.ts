import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Web3LoginDTO {
  @ApiProperty({ required: true })
  @IsString()
  addr: string;

  @ApiProperty({ required: true })
  @IsString()
  message: string;

  @ApiProperty({ required: true })
  @IsString()
  signature: string;
}
