import { Test, TestingModule } from '@nestjs/testing';
import { CheckinService } from './checkin.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CheckinService', () => {
  let service: CheckinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckinService,
        {
          provide: PrismaService,
          useValue: {
            event: { findUnique: jest.fn() },
            orgMember: { findUnique: jest.fn() },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CheckinService>(CheckinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
