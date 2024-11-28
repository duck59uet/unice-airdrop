import { Module } from '@nestjs/common';
import { PoolController } from './pool.controller';
import { PoolService } from './pool.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StakingPoolEntity } from './entities/pool.entity';
import { PoolRepository } from './pool.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StakingPoolEntity])],
  controllers: [PoolController],
  providers: [PoolService, PoolRepository],
  exports: [PoolRepository],
})
export class PoolModule {}
