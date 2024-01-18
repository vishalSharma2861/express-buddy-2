import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';

import { Model } from 'mongoose';
import { DriverDocument, DriverModel } from './schema/driver.schema';
import { accountStatus } from './enum/driver.enum';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class AdminDriverService {
  constructor(
    @InjectModel(DriverModel.name)
    private readonly driverModel: Model<DriverDocument>,
    private readonly paginationService: PaginationService,
  ) {}

  async pendingDriverFilter(query: Query) {
    try {
      const { search, type, page } = query;
      const resPerPage = 10;
      const currentPage = Number(page) || 1;
      const skip = (currentPage - 1) * resPerPage;

      const filter = {
        accountStatus: accountStatus.PENDING,
      };

      if (type && search) {
        filter['licenseType'] = type;
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
            licenseType: { $regex: search, $options: 'i' },
          },
          {
            driverId: { $regex: search, $options: 'i' },
          },
        ];
      } else if (type) {
        filter['licenseType'] = type;
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
            licenseType: { $regex: search, $options: 'i' },
          },
          {
            driverId: { $regex: search, $options: 'i' },
          },
        ];
      }

      const driver = await this.driverModel
        .find(filter)
        .select({
          firebaseUid: 0,
          balance: 0,
          totalEarning: 0,
          totalTrip: 0,
          lastCashGiven: 0,
          nric_f: 0,
          nric_b: 0,
          nameAsInBankAccount: 0,
          dl_b: 0,
          dl_f: 0,
          bankAccountNumber: 0,
          __v: 0,
          updatedAt: 0,
          cashToSubmit: 0,
          bankName: 0,
        })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(resPerPage);

      const result = await this.paginationService.driverPagination(
        filter,
        query,
      );
      return { result, data: driver };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async currentDriverFilter(query: Query) {
    try {
      const { search, type, status, account_type, page } = query;

      const resPerPage = 10;
      const currentPage = Number(page) || 1;
      const skip = (currentPage - 1) * resPerPage;

      const filter = {};

      if (account_type && type && status && search) {
        filter['accountStatus'] = account_type;
        filter['licenseType'] = type;
        filter['status'] = status;
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
            licenseType: { $regex: search, $options: 'i' },
          },
          {
            driverId: { $regex: search, $options: 'i' },
          },
        ];
      } else if (account_type && type && search) {
        filter['accountStatus'] = account_type;
        filter['licenseType'] = type;
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
            licenseType: { $regex: search, $options: 'i' },
          },
          {
            driverId: { $regex: search, $options: 'i' },
          },
        ];
      } else if (account_type && status && search) {
        filter['accountStatus'] = account_type;
        filter['status'] = status;
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
            licenseType: { $regex: search, $options: 'i' },
          },
          {
            driverId: { $regex: search, $options: 'i' },
          },
        ];
      } else if (account_type && type && status) {
        filter['accountStatus'] = account_type;
        filter['licenseType'] = type;
        filter['status'] = status;
      } else if (account_type && type) {
        filter['accountStatus'] = account_type;
        filter['licenseType'] = type;
      } else if (account_type && status) {
        filter['accountStatus'] = account_type;
        filter['status'] = status;
      } else if (account_type && search) {
        filter['accountStatus'] = account_type;
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
            licenseType: { $regex: search, $options: 'i' },
          },
          {
            driverId: { $regex: search, $options: 'i' },
          },
        ];
      } else if (account_type) {
        filter['accountStatus'] = account_type;
      } else if (type) {
        filter['licenseType'] = type;
      } else if (status) {
        filter['status'] = status;
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
            licenseType: { $regex: search, $options: 'i' },
          },
          {
            driverId: { $regex: search, $options: 'i' },
          },
        ];
      }

      const driver = await this.driverModel
        .find(filter)
        .select({
          firebaseUid: 0,
          balance: 0,
          lastCashGiven: 0,
          nric_f: 0,
          nric_b: 0,
          nameAsInBankAccount: 0,
          dl_b: 0,
          dl_f: 0,
          bankAccountNumber: 0,
          __v: 0,
          updatedAt: 0,
          cashToSubmit: 0,
          bankName: 0,
        })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(resPerPage);

      const result = await this.paginationService.driverPagination(
        filter,
        query,
      );

      return {
        result,
        drivers: driver,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
