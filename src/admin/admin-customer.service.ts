import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { UserDocument, UserModel } from './schema/user.schema';
import { PaginationService } from 'src/pagination/pagination.service';
import { BookingDocument, BookingModel } from './schema/booking.schema';
import { BOOKING_STATUS } from './enum/booking.enum';

@Injectable()
export class AdminCustomerService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(BookingModel.name)
    private readonly bookingModel: Model<BookingDocument>,
    private readonly paginationService: PaginationService,
  ) {}

  async allCustomers(query) {
    try {
      const { search, type, page } = query;
      const resPerPage = 10;
      const currentPage = Number(page) || 1;
      const skip = (currentPage - 1) * resPerPage;

      const filter = {};

      const ags: any[] = [
        {
          $lookup: {
            from: 'bookingmodels',
            localField: '_id',
            foreignField: 'createdBy',
            as: 'booking_detail',
          },
        },
        {
          $unwind: {
            path: '$booking_detail',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            phoneNumber: 1,
            email: 1,
            firstName: 1,
            lastName: 1,
            userId: 1,
            carPlateNumber: 1,
            vehicleType: 1,
            phoneCode: 1,
            isDeleted: 1,

            'booking_detail._id': 1,
            'booking_detail.createdBy': 1,
            'booking_detail.totalPayableAmount': 1,
          },
        },

        {
          $group: {
            _id: '$_id',
            totalOrders: {
              $sum: {
                $cond: [{ $ifNull: ['$booking_detail', false] }, 1, 0],
              },
            },
            totalPayableAmount: { $sum: '$booking_detail.totalPayableAmount' },
            phoneNumber: { $first: '$phoneNumber' },
            email: { $first: '$email' },
            firstName: { $first: '$firstName' },
            lastName: { $first: '$lastName' },
            userId: { $first: '$userId' },
            carPlateNumber: { $first: '$carPlateNumber' },
            vehicleType: { $first: '$vehicleType' },
            phoneCode: { $first: '$phoneCode' },
            isDeleted: { $first: '$isDeleted' },
          },
        },
      ];

      if (type && search) {
        filter['vehicleType'] = type;
        filter['$or'] = [
          {
            firstName: { $regex: search, $options: 'i' },
          },
          {
            lastName: { $regex: search, $options: 'i' },
          },
          {
            $expr: {
              $regexMatch: {
                input: {
                  $concat: ['$firstName', ' ', '$lastName'],
                },
                regex: search,
                options: 'i',
              },
            },
          },

          {
            email: { $regex: search, $options: 'i' },
          },
          {
            phoneNumber: { $regex: search, $options: 'i' },
          },
          {
            carPlateNumber: { $regex: search, $options: 'i' },
          },
          {
            userId: { $regex: search, $options: 'i' },
          },
        ];
      } else if (type) {
        filter['vehicleType'] = type;
      } else if (search) {
        filter['$or'] = [
          {
            firstName: { $regex: search, $options: 'i' },
          },
          {
            lastName: { $regex: search, $options: 'i' },
          },
          {
            $expr: {
              $regexMatch: {
                input: {
                  $concat: ['$firstName', ' ', '$lastName'],
                },
                regex: search,
                options: 'i',
              },
            },
          },

          {
            email: { $regex: search, $options: 'i' },
          },
          {
            phoneNumber: { $regex: search, $options: 'i' },
          },
          {
            carPlateNumber: { $regex: search, $options: 'i' },
          },
          {
            userId: { $regex: search, $options: 'i' },
          },
        ];
      }

      ags.push({ $match: filter });

      const users = await this.userModel
        .aggregate(ags)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(resPerPage);
      ags.push({
        $count: 'totalCount',
      });

      const meta = await this.paginationService.customerPagination(ags, query);
      return {
        message: 'Customer List',
        data: { users },
        meta,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async customerView(id: string) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('User Id not found');
      }
      const orders = await this.bookingModel
        .find({
          createdBy: user._id,
        })
        .select({ _id: 1, totalPayableAmount: 1 })
        .sort({ _id: -1 });

      const $group = {
        _id: null,
        totalAmount: {
          $sum: '$totalPayableAmount',
        },
      };
      const ags = [
        {
          $match: {
            createdBy: user._id,
          },
        },
        {
          $group,
        },
      ];

      const totalAmount = await this.bookingModel.aggregate(ags);
      let total = 0;
      if (totalAmount?.length) {
        total = totalAmount[0].totalAmount;
      }

      return {
        userInfo: user,
        count: orders.length,
        fees: total,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async customerDelete(id: string) {
    try {
      const customer = await this.userModel.findById(id);
      if (!customer) {
        throw new NotFoundException('customer Id not found');
      }
      const bookings = await this.bookingModel.find({
        createdBy: customer._id,
      });
      for (let i = 0; i < bookings.length; i++) {
        if (
          [
            BOOKING_STATUS.PENDING,
            BOOKING_STATUS.ACCEPTED,
            BOOKING_STATUS.ASSIGNED,
            BOOKING_STATUS.ARRIVED,
            BOOKING_STATUS.STARTED,
          ].includes(bookings[i].status)
        ) {
          throw new NotAcceptableException(
            'This Customer account can not be banned',
          );
        }
      }

      // await this.notificationService.sendNotification(
      //   customer,
      //   'CUSTOMER_DELETE',
      // );
      // await this.userService.removeMultipleDevices({
      //   createdBy: id,
      // });

      if (customer.isDeleted === false) {
        customer.isDeleted = true;
      } else {
        customer.isDeleted = false;
      }
      await customer.save();

      return { message: 'Customer updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
