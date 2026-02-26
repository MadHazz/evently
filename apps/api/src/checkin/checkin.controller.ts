import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckinService } from './checkin.service';
import { ScanTicketDto } from './dto/checkin.dto';

@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('scan')
  async scanTicket(@Request() req: any, @Body() dto: ScanTicketDto) {
    return this.checkinService.scanTicket(req.user.id, dto);
  }
}
