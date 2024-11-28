import { Test, TestingModule } from '@nestjs/testing';
import { StakingDataController } from './staking-data.controller';

describe('StakingDataController', () => {
  let controller: StakingDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StakingDataController],
    }).compile();

    controller = module.get<StakingDataController>(StakingDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
