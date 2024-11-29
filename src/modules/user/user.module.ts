import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { StakingDataModule } from '../../modules/staking-data/staking-data.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), StakingDataModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
