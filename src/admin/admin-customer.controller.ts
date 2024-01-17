import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminCustomerService } from './admin-customer.service';

@UseGuards(JwtAuthGuard)
@Controller('admin/customer')
export class AdminCustomerController {
  constructor(private readonly admincustomerService: AdminCustomerService) {}

  @Get('list')
  bookingList(@Query() query) {
    return this.admincustomerService.allCustomers(query);
  }
}
