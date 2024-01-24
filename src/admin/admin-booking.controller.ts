import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { AdminBookingService } from './admin-booking.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookingQueryDto } from './dto/booking.dto';

// @UseGuards(JwtAuthGuard)
@Controller('admin/booking')
export class AdminBookingController {
  constructor(private readonly adminbookingService: AdminBookingService) {}

  @Get('count')
  bookingCount() {
    return this.adminbookingService.getCount();
  }

  @Get('list')
  bookingList(@Query() query: BookingQueryDto) {
    return this.adminbookingService.allBookings(query);
  }
}
