import { Test, TestingModule } from '@nestjs/testing';
import { StakingDataService } from './staking-data.service';

describe('StakingDataService', () => {
  let service: StakingDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StakingDataService],
    }).compile();

    service = module.get<StakingDataService>(StakingDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
