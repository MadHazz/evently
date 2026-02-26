import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TicketService', () => {
  let service: TicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: PrismaService,
          useValue: {
            ticketType: { create: jest.fn(), findUnique: jest.fn() },
            ticket: { createMany: jest.fn(), count: jest.fn() },
            order: { create: jest.fn(), findMany: jest.fn() },
            event: { findUnique: jest.fn() },
            orgMember: { findUnique: jest.fn() },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
