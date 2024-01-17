import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { AdminDriverService } from './admin-driver.service';

@UseGuards(JwtAuthGuard)
@Controller('admin/driver')
export class AdminDriverController {
  constructor(private readonly admindriverService: AdminDriverService) {}

  @Get('pending')
  pendingList(@Query() query) {
    return this.admindriverService.pendingDriverFilter(query);
  }

  @Get('current')
  currentList(@Query() query) {
    return this.admindriverService.currentDriverFilter(query);
  }
}
