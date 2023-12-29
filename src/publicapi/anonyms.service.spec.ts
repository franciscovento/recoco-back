import { Test, TestingModule } from '@nestjs/testing';
import { AnonymsService } from './Anonyms.service';

describe('AnonymsService', () => {
  let service: AnonymsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnonymsService],
    }).compile();

    service = module.get<AnonymsService>(AnonymsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
