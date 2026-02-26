import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateEventDto } from './dto/event.dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req: any, @Body() createEventDto: CreateEventDto) {
    return this.eventService.create(req.user.id, createEventDto);
  }

  @Get()
  async findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }
}
