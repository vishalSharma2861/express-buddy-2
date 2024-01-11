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

@Module({
  imports: [
    PaginationModule,
    MongooseModule.forFeature([
      { name: AdminModel.name, schema: AdminSchema },
      { name: BookingModel.name, schema: BookingSchema },
      { name: UserModel.name, schema: UserSchema },
      { name: DriverModel.name, schema: DriverSchema },
    ]),
  ],
  controllers: [AdminController, AdminBookingController],
  providers: [AdminService, AdminBookingService],
})
export class AdminModule {}
