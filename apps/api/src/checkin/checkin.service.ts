import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScanTicketDto } from './dto/checkin.dto';

@Injectable()
export class CheckinService {
  constructor(private prisma: PrismaService) {}

  async scanTicket(userId: string, dto: ScanTicketDto) {
    // 1. Verify user is Event Staff/Owner
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
        'You do not have permission to check in attendees for this event',
      );
    }

    // 2. Process ticket atomically
    return this.prisma.$transaction(async (prisma) => {
      const ticket = await prisma.ticket.findUnique({
        where: { qrCode: dto.qrCode },
        include: {
          order: true,
          ticketType: true,
        },
      });

      if (!ticket) {
        throw new NotFoundException('Invalid ticket QR code');
      }

      if (ticket.order.eventId !== dto.eventId) {
        throw new BadRequestException('This ticket is not for this event');
      }

      if (ticket.status === 'USED') {
        throw new BadRequestException(
          `Ticket was already scanned at ${ticket.scannedAt}`,
        );
      }

      if (ticket.status === 'CANCELLED') {
        throw new BadRequestException('This ticket has been cancelled');
      }

      // 3. Mark as used
      const checkedInTicket = await prisma.ticket.update({
        where: { id: ticket.id },
        data: {
          status: 'USED',
          scannedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Checked In',
        ticket: {
          id: checkedInTicket.id,
          status: checkedInTicket.status,
          scannedAt: checkedInTicket.scannedAt,
          ticketTypeName: ticket.ticketType.name,
          customerName: ticket.order.customerName,
          customerEmail: ticket.order.customerEmail,
        },
      };
    });
  }
}
