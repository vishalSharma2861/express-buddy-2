import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { UserDocument, UserModel } from './schema/user.schema';
import { PaginationService } from 'src/pagination/pagination.service';
import Stripe from 'stripe';

@Injectable()
export class AdminCustomerService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
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

      const result = await this.paginationService.customerPagination(
        ags,
        query,
      );
      return {
        result,
        customers: users,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
