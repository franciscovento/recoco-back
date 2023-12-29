import { Test, TestingModule } from '@nestjs/testing';
import { AnonymsController } from './Anonyms.controller';
import { AnonymsService } from './Anonyms.service';

describe('AnonymsController', () => {
  let controller: AnonymsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnonymsController],
      providers: [AnonymsService],
    }).compile();

    controller = module.get<AnonymsController>(AnonymsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
