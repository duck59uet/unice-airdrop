import { forwardRef, Module } from '@nestjs/common';
import { StakingDataController } from './staking-data.controller';
import { StakingDataService } from './staking-data.service';
import { StakingDataRepository } from './staking-data.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StakingDataEntity } from './entities/staking-data.entity';
import { UserModule } from '../../modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([StakingDataEntity]), forwardRef(() => UserModule)],
  controllers: [StakingDataController],
  providers: [StakingDataService, StakingDataRepository],
  exports: [StakingDataRepository],
})
export class StakingDataModule {}
