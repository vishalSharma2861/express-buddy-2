import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { PaginationController } from './pagination.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingModel, BookingSchema } from 'src/admin/schema/booking.schema';
import { UserModel, UserSchema } from 'src/admin/schema/user.schema';
import { DriverModel, DriverSchema } from 'src/admin/schema/driver.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookingModel.name, schema: BookingSchema },
      { name: UserModel.name, schema: UserSchema },
      { name: DriverModel.name, schema: DriverSchema },
    ]),
  ],
  controllers: [PaginationController],
  providers: [PaginationService],
  exports: [PaginationService],
})
export class PaginationModule {}
