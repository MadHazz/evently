import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketTypeDto, OrderTicketDto } from './dto/ticket.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async createTicketType(userId: string, dto: CreateTicketTypeDto) {
    // Verify user is an org member of the event's org
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
      include: { org: true },
    });

    if (!event) throw new NotFoundException('Event not found');

    const membership = await this.prisma.orgMember.findUnique({
      where: {
        orgId_userId: {
          orgId: event.orgId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You do not have permission to manage tickets for this event',
      );
    }

    return this.prisma.ticketType.create({
      data: {
        eventId: dto.eventId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async createOrder(userId: string | undefined, dto: OrderTicketDto) {
    return this.prisma.$transaction(async (prisma) => {
      // 1. Check ticket type + event exist
      const ticketType = await prisma.ticketType.findUnique({
        where: { id: dto.ticketTypeId },
        include: { event: true },
      });

      if (!ticketType || ticketType.eventId !== dto.eventId) {
        throw new NotFoundException('Ticket type not found for this event');
      }

      // 2. Check inventory availability
      // We check how many tickets have been sold so far
      const soldTicketsCount = await prisma.ticket.count({
        where: { ticketTypeId: ticketType.id, status: { not: 'CANCELLED' } },
      });

      if (soldTicketsCount + dto.quantity > ticketType.quantity) {
        throw new BadRequestException('Not enough tickets available');
      }

      // Calculate total amount
      const totalAmount = Number(ticketType.price) * dto.quantity;

      // 3. Create Order
      const order = await prisma.order.create({
        data: {
          eventId: dto.eventId,
          userId: userId, // associate to user account if passed via header
          customerEmail: dto.customerEmail,
          customerName: dto.customerName,
          totalAmount: totalAmount,
          status: 'PAID', // Auto-PAID for mvp
        },
      });

      // 4. Create individual tickets
      const ticketsToCreate = Array.from({ length: dto.quantity }).map(() => ({
        orderId: order.id,
        ticketTypeId: ticketType.id,
        status: 'VALID',
      }));

      await prisma.ticket.createMany({
        data: ticketsToCreate,
      });

      return order;
    });
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        event: { select: { title: true, startDate: true, location: true } },
        tickets: {
          include: { ticketType: { select: { name: true } } },
        },
      },
    });
  }
}
