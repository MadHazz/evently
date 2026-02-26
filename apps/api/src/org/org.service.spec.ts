import { Test, TestingModule } from '@nestjs/testing';
import { OrgService } from './org.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OrgService', () => {
  let service: OrgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrgService,
        {
          provide: PrismaService,
          useValue: {
            org: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
            },
            orgMember: {
              create: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrgService>(OrgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
