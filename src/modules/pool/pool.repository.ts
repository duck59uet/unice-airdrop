import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StakingPoolEntity } from './entities/pool.entity';


@Injectable()
export class PoolRepository {
  public readonly logger = new Logger(PoolRepository.name);

  constructor(
    @InjectRepository(StakingPoolEntity)
    public repo: Repository<StakingPoolEntity>,
  ) {
    this.logger.log(
      '============== Constructor StakingPool Repository ==============',
    );
  }
}
