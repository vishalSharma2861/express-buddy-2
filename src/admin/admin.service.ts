import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { Model } from 'mongoose';
import { AdminDocument, AdminModel } from './schema/admin.schema';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(AdminModel.name)
    private readonly adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
  ) {}

  async getUserEmail(email: string) {
    return this.adminModel.findOne({
      email,
    });
  }

  async registerAdmin(dto) {
    try {
      const saltOrRounds = 12;
      const password = await bcrypt.hash(dto.password, saltOrRounds);
      const { email } = dto;
      const userName = dto.userName.toLowerCase();

      const emailExist = await this.adminModel.find({ email: email });
      if (emailExist.length) {
        throw new NotAcceptableException(
          'This Email is exist with another account',
        );
      }

      const userNameExist = await this.adminModel.find({ userName: userName });
      if (userNameExist.length) {
        throw new NotAcceptableException('This Username is exist');
      }

      const admin = await this.adminModel.create({
        userName,
        email,
        password,
      });

      await admin.save();
      return { message: 'Admin has added successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
