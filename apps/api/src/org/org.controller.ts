import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrgDto } from './dto/org.dto';
import { OrgService } from './org.service';

@UseGuards(AuthGuard('jwt'))
@Controller('org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @Post()
  async create(@Request() req: any, @Body() createOrgDto: CreateOrgDto) {
    return this.orgService.create(req.user.id, createOrgDto);
  }

  @Get()
  async getUserOrgs(@Request() req: any) {
    return this.orgService.getUserOrgs(req.user.id);
  }
}
