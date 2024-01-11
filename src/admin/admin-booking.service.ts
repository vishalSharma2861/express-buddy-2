import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { BookingDocument, BookingModel } from './schema/booking.schema';
import { DriverDocument, DriverModel } from './schema/driver.schema';
import { UserDocument, UserModel } from './schema/user.schema';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class AdminBookingService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(DriverModel.name)
    private readonly driverModel: Model<DriverDocument>,
    @InjectModel(BookingModel.name)
    private readonly bookingModel: Model<BookingDocument>,
    private readonly paginationService: PaginationService,
  ) {}

  async allBookings(query) {
    try {
      const { page } = query;
      const resPerPage = 10;
      const currentPage = Number(page) || 1;
      const skip = (currentPage - 1) * resPerPage;

      const ags: any[] = [
        {
          $lookup: {
            from: 'usermodels',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'user_detail',
          },
        },
        {
          $unwind: {
            path: '$user_detail',
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: 'drivermodels',
            localField: 'assignedTo',
            foreignField: '_id',
            as: 'assigned_to',
          },
        },

        {
          $unwind: {
            path: '$assigned_to',
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            veletType: 1,
            BookingId: 1,
            status: 1,
            BookingAt: 1,
            startPoint: 1,
            endPoint: 1,
            otherPoints: 1,

            totalPayableAmount: 1,
            paymentType: 1,
            paymentFailed: 1,
            createdAt: 1,

            'user_detail._id': 1,
            'user_detail.firstName': 1,
            'user_detail.lastName': 1,
            'user_detail.phoneNumber': 1,
            'user_detail.phoneCode': 1,
            'user_detail.vehicleType': 1,
            userFullName: {
              $concat: ['$user_detail.firstName', ' ', '$user_detail.lastName'],
            },

            'assigned_to._id': 1,
            'assigned_to.firstName': 1,
            'assigned_to.lastName': 1,
            'assigned_to.phoneNumber': 1,
            'assigned_to.phoneCode': 1,
            assignedFullName: {
              $concat: ['$assigned_to.firstName', ' ', '$assigned_to.lastName'],
            },
          },
        },
      ];
      const bookings = await this.bookingModel
        .aggregate(ags)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(resPerPage);
      ags.push({
        $count: 'totalCount',
      });

      const count = await this.bookingModel.aggregate(ags);
      const totalCount = count?.[0]?.totalCount;
      const totalPages = Math.ceil(totalCount / resPerPage);
      const hasNextPage = currentPage < totalPages;

      return {
        meta: { totalPages, hasNextPage },
        booking: bookings,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
