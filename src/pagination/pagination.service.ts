import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookingDocument, BookingModel } from 'src/admin/schema/booking.schema';
import { DriverDocument, DriverModel } from 'src/admin/schema/driver.schema';
import { UserDocument, UserModel } from 'src/admin/schema/user.schema';

@Injectable()
export class PaginationService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(DriverModel.name)
    private readonly driverModel: Model<DriverDocument>,
    @InjectModel(BookingModel.name)
    private readonly bookingModel: Model<BookingDocument>,
  ) {}

  async bookingPagination(ags, query) {
    try {
      const { page } = query;
      const resPerPage = 10;
      const currentPage = Number(page) || 1;
      const skip = (currentPage - 1) * resPerPage;
      const count = await this.bookingModel.aggregate(ags);
      const totalCount = count?.[0]?.totalCount;
      const totalPages = Math.ceil(totalCount / resPerPage);
      const hasNextPage = currentPage < totalPages;

      return { count, totalCount, totalPages, hasNextPage };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
