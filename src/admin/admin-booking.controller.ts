import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { AdminBookingService } from './admin-booking.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin/booking')
export class AdminBookingController {
  constructor(private readonly adminbookingService: AdminBookingService) {}

  @Get('list')
  bookingList(@Query() query) {
    return this.adminbookingService.allBookings(query);
  }
}
