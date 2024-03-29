import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminModel, AdminSchema } from './schema/admin.schema';
import { AdminBookingController } from './admin-booking.controller';
import { AdminBookingService } from './admin-booking.service';
import { BookingModel, BookingSchema } from './schema/booking.schema';
import { UserModel, UserSchema } from './schema/user.schema';
import { DriverModel, DriverSchema } from './schema/driver.schema';
import { PaginationModule } from 'src/pagination/pagination.module';
import { AdminCustomerController } from './admin-customer.controller';
import { AdminCustomerService } from './admin-customer.service';
import { AdminDriverController } from './admin-driver.controller';
import { AdminDriverService } from './admin-driver.service';
import {
  BookingTransactionModel,
  BookingTransactionSchema,
} from './schema/booking-transaction.schema';

@Module({
  imports: [
    PaginationModule,
    MongooseModule.forFeature([
      { name: AdminModel.name, schema: AdminSchema },
      { name: BookingModel.name, schema: BookingSchema },
      { name: UserModel.name, schema: UserSchema },
      { name: DriverModel.name, schema: DriverSchema },
      { name: BookingTransactionModel.name, schema: BookingTransactionSchema },
    ]),
  ],
  controllers: [
    AdminController,
    AdminBookingController,
    AdminCustomerController,
    AdminDriverController,
  ],
  providers: [
    AdminService,
    AdminBookingService,
    AdminCustomerService,
    AdminDriverService,
  ],
})
export class AdminModule {}
