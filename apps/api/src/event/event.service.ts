import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createEventDto: CreateEventDto) {
    // Verify user is a member of the organization
    const membership = await this.prisma.orgMember.findUnique({
      where: {
        orgId_userId: {
          orgId: createEventDto.orgId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You do not have permission to create an event for this organization',
      );
    }

    return this.prisma.event.create({
      data: {
        orgId: createEventDto.orgId,
        title: createEventDto.title,
        description: createEventDto.description,
        startDate: new Date(createEventDto.startDate),
        endDate: new Date(createEventDto.endDate),
        location: createEventDto.location,
        status: 'PUBLISHED', // Defaulting to published for now
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { startDate: 'asc' },
      include: {
        org: { select: { name: true, slug: true } },
      },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        org: { select: { name: true, slug: true } },
        ticketTypes: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }
}
