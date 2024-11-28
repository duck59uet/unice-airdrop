import { Module } from '@nestjs/common';
import { StakingDataController } from './staking-data.controller';
import { StakingDataService } from './staking-data.service';
import { StakingdataRepository } from './staking-data.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StakingDataEntity } from './entities/staking-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StakingDataEntity])],
  controllers: [StakingDataController],
  providers: [StakingDataService, StakingdataRepository],
  exports: [StakingdataRepository],
})
export class StakingDataModule {}
