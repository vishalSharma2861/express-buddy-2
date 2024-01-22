import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { BookingDocument, BookingModel } from './schema/booking.schema';
import { DriverDocument, DriverModel } from './schema/driver.schema';
import { UserDocument, UserModel } from './schema/user.schema';
import { PaginationService } from 'src/pagination/pagination.service';
import { BOOKING_STATUS, BOOKING_TYPE } from './enum/booking.enum';

import * as moment from 'moment';
import { BookingQueryDto } from './dto/booking.dto';

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

  getStatusFilter(type, filterType) {
    type = type.toUpperCase();
    if (filterType === 'status') {
      switch (type) {
        case 'AVAILABLE':
          return { $in: [BOOKING_STATUS.ASSIGNED] };

        case 'ONGOING':
          return {
            $in: [
              BOOKING_STATUS.ACCEPTED,
              BOOKING_STATUS.STARTED,
              BOOKING_STATUS.ARRIVED,
            ],
          };

        case 'CURRENT':
          return {
            $in: [
              BOOKING_STATUS.PENDING,
              BOOKING_STATUS.STARTED,
              BOOKING_STATUS.ASSIGNED,
              BOOKING_STATUS.ACCEPTED,
              BOOKING_STATUS.ARRIVED,
            ],
          };

        case 'PAST':
          return {
            $in: [
              BOOKING_STATUS.DECLINED,
              BOOKING_STATUS.CANCELLED,
              BOOKING_STATUS.COMPLETED,
              BOOKING_STATUS.CUSTOMER_NO_SHOW,
            ],
          };

        case 'COMPLETED':
          return {
            $in: [
              BOOKING_STATUS.COMPLETED,
              BOOKING_STATUS.CANCELLED,
              BOOKING_STATUS.DECLINED,
              BOOKING_STATUS.CUSTOMER_NO_SHOW,
            ],
          };

        default:
          return null;
      }
    } else if (filterType === 'bookingType') {
      switch (type) {
        case BOOKING_TYPE.NOW:
          const timeStamp15MLater = moment().add(15, 'minutes').unix();
          return { $lte: timeStamp15MLater };

        case BOOKING_TYPE.LATER:
          const timeStamp15MLaterL = moment().add(15, 'minutes').unix();
          const timeStamp12HLater = moment().add(12, 'hours').unix();
          return { $gte: timeStamp15MLaterL, $lte: timeStamp12HLater };

        case BOOKING_TYPE.ADVANCE:
          const timeStamp12HLaterA = moment().add(12, 'hours').unix();
          return { $gte: timeStamp12HLaterA };

        default:
          break;
      }
    }
  }

  async allBookings(query: BookingQueryDto) {
    try {
      const { page, search, type, status: st, bookingType } = query;
      const resPerPage = 10;
      const currentPage = Number(page) || 1;

      const skip = (currentPage - 1) * resPerPage;

      let status = st;

      if (!status) {
        status = { $ne: BOOKING_STATUS.DELETED };
      }

      if (status === 'IN_TRANSIT') {
        status = { $in: [BOOKING_STATUS.STARTED] };
      } else if (status === 'OTW') {
        status = { $in: [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.ARRIVED] };
      }

      let countFilter = {};

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

      if (bookingType && type && status && search) {
        const data = { $regex: search, $options: 'i' };
        countFilter = {
          BookingAt: this.getStatusFilter(bookingType, 'bookingType'),
          veletType: type,
          status: status,
          $or: [
            {
              BookingId: Number(search),
            },
            {
              'user_detail.phoneNumber': search,
            },
            {
              'assigned_to.phoneNumber': search,
            },
            {
              'user_detail.firstName': data,
            },
            {
              'user_detail.lastName': data,
            },
            {
              userFullName: data,
            },
            {
              'assigned_to.firstName': data,
            },
            {
              'assigned_to.lastName': data,
            },
            {
              assignedFullName: data,
            },
          ],
        };
      } else if (bookingType && type && status) {
        countFilter = {
          BookingAt: this.getStatusFilter(bookingType, 'bookingType'),
          veletType: type,
          status: status,
        };
      } else if (bookingType && type && search) {
        const data = { $regex: search, $options: 'i' };
        countFilter = {
          BookingAt: this.getStatusFilter(bookingType, 'bookingType'),
          veletType: type,
          $or: [
            {
              BookingId: Number(search),
            },
            {
              'user_detail.phoneNumber': search,
            },
            {
              'assigned_to.phoneNumber': search,
            },
            {
              'user_detail.firstName': data,
            },
            {
              'user_detail.lastName': data,
            },
            {
              userFullName: data,
            },
            {
              'assigned_to.firstName': data,
            },
            {
              'assigned_to.lastName': data,
            },
            {
              assignedFullName: data,
            },
          ],
        };
      } else if (bookingType && search && status) {
        const data = { $regex: search, $options: 'i' };

        countFilter = {
          BookingAt: this.getStatusFilter(bookingType, 'bookingType'),
          status: status,
          $or: [
            {
              BookingId: Number(search),
            },
            {
              'user_detail.phoneNumber': search,
            },
            {
              'assigned_to.phoneNumber': search,
            },
            {
              'user_detail.firstName': data,
            },
            {
              'user_detail.lastName': data,
            },
            {
              userFullName: data,
            },
            {
              'assigned_to.firstName': data,
            },
            {
              'assigned_to.lastName': data,
            },
            {
              assignedFullName: data,
            },
          ],
        };
      } else if (search && type && status) {
        const data = { $regex: search, $options: 'i' };

        countFilter = {
          $or: [
            {
              BookingId: Number(search),
            },
            {
              'user_detail.phoneNumber': search,
            },
            {
              'assigned_to.phoneNumber': search,
            },
            {
              'user_detail.firstName': data,
            },
            {
              'user_detail.lastName': data,
            },
            {
              userFullName: data,
            },
            {
              'assigned_to.firstName': data,
            },
            {
              'assigned_to.lastName': data,
            },
            {
              assignedFullName: data,
            },
          ],
          veletType: type,
          status: status,
        };
      } else if (search && status) {
        const data = { $regex: search, $options: 'i' };

        countFilter = {
          $or: [
            {
              BookingId: Number(search),
            },
            {
              'user_detail.phoneNumber': search,
            },
            {
              'assigned_to.phoneNumber': search,
            },
            {
              'user_detail.firstName': data,
            },
            {
              'user_detail.lastName': data,
            },
            {
              userFullName: data,
            },
            {
              'assigned_to.firstName': data,
            },
            {
              'assigned_to.lastName': data,
            },
            {
              assignedFullName: data,
            },
          ],
          status: status,
        };
      } else if (bookingType && type) {
        countFilter = {
          BookingAt: this.getStatusFilter(bookingType, 'bookingType'),
          status: {
            $in: [
              BOOKING_STATUS.PENDING,
              BOOKING_STATUS.ASSIGNED,
              BOOKING_STATUS.ACCEPTED,
            ],
          },
          veletType: type,
        };
      } else if (bookingType && status) {
        countFilter = {
          BookingAt: this.getStatusFilter(bookingType, 'bookingType'),
          status: status,
        };
      } else if (bookingType && search) {
        const data = { $regex: search, $options: 'i' };

        countFilter = {
          BookingAt: this.getStatusFilter(bookingType, 'bookingType'),
          status: {
            $in: [
              BOOKING_STATUS.PENDING,
              BOOKING_STATUS.ASSIGNED,
              BOOKING_STATUS.ACCEPTED,
            ],
          },
          $or: [
            {
              BookingId: Number(search),
            },
            {
              'user_detail.phoneNumber': search,
            },
            {
              'assigned_to.phoneNumber': search,
            },
            {
              'user_detail.firstName': data,
            },
            {
              'user_detail.lastName': data,
            },
            {
              userFullName: data,
            },
            {
              'assigned_to.firstName': data,
            },
            {
              'assigned_to.lastName': data,
            },
            {
              assignedFullName: data,
            },
          ],
        };
      } else if (type && status) {
        countFilter = {
          veletType: type,
          status: status,
        };
      } else if (type && search) {
        const data = { $regex: search, $options: 'i' };

        countFilter = {
          veletType: type,
          $or: [
            {
              BookingId: Number(search),
            },
            {
              'user_detail.phoneNumber': search,
            },
            {
              'assigned_to.phoneNumber': search,
            },
            {
              'user_detail.firstName': data,
            },
            {
              'user_detail.lastName': data,
            },
            {
              userFullName: data,
            },
            {
              'assigned_to.firstName': data,
            },
            {
              'assigned_to.lastName': data,
            },
            {
              assignedFullName: data,
            },
          ],
        };
      } else if (status && search) {
        const data = { $regex: search, $options: 'i' };

        countFilter = {
          veletType: status,
          $or: [
            {
              BookingId: Number(search),
            },
            {
              'user_detail.phoneNumber': search,
            },
            {
              'assigned_to.phoneNumber': search,
            },
            {
              'user_detail.firstName': data,
            },
            {
              'user_detail.lastName': data,
            },
            {
              userFullName: data,
            },
            {
              'assigned_to.firstName': data,
            },
            {
              'assigned_to.lastName': data,
            },
            {
              assignedFullName: data,
            },
          ],
        };
      } else if (search) {
        const data = { $regex: search, $options: 'i' };

        countFilter['$or'] = [
          {
            BookingId: Number(search),
          },
          {
            'user_detail.phoneNumber': search,
          },
          {
            'assigned_to.phoneNumber': search,
          },
          {
            'user_detail.firstName': data,
          },
          {
            'user_detail.lastName': data,
          },
          {
            userFullName: data,
          },
          {
            'assigned_to.firstName': data,
          },
          {
            'assigned_to.lastName': data,
          },
          {
            assignedFullName: data,
          },
        ];
      } else if (type) {
        countFilter = {
          veletType: type,
        };
      } else if (status) {
        countFilter = {
          status: status,
        };
      } else if (bookingType) {
        countFilter = {
          BookingAt: this.getStatusFilter(bookingType, 'bookingType'),
          status: {
            $in: [
              BOOKING_STATUS.PENDING,
              BOOKING_STATUS.ASSIGNED,
              BOOKING_STATUS.ACCEPTED,
            ],
          },
        };
      }

      countFilter['paymentFailed'] = false;
      ags.push({ $match: countFilter });
      const bookings = await this.bookingModel
        .aggregate(ags)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(resPerPage);
      ags.push({
        $count: 'totalCount',
      });

      // const count = await this.bookingModel.aggregate(ags);
      // const totalCount = count?.[0]?.totalCount;
      // const totalPages = Math.ceil(totalCount / resPerPage);
      // const hasNextPage = currentPage < totalPages;

      const meta = await this.paginationService.bookingPagination(ags, query);
      return {
        message: 'Booking List',
        data: { bookings },
        meta,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
