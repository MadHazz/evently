import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';
import { CreateTicketTypeDto, OrderTicketDto } from './dto/ticket.dto';
import { TicketService } from './ticket.service';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('type')
  async createTicketType(
    @Request() req: any,
    @Body() dto: CreateTicketTypeDto,
  ) {
    return this.ticketService.createTicketType(req.user.id, dto);
  }

  // Optional JWT guard for ordering tickets. If not provided, it's a guest checkout.
  @UseGuards(OptionalJwtAuthGuard)
  @Post('order')
  async createOrder(@Request() req: any, @Body() dto: OrderTicketDto) {
    // In a real app we'd use an optional AuthGuard. For now we just extract from request if available.
    // The passport strategy puts the user on req.user if authenticated.
    const userId = req.user?.id;
    return this.ticketService.createOrder(userId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('order/my-orders')
  async getUserOrders(@Request() req: any) {
    return this.ticketService.getUserOrders(req.user.id);
  }
}
