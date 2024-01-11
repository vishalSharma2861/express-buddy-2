import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/admin/hash.service';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AdminDocument, AdminModel } from 'src/admin/schema/admin.schema';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AdminModel.name) private adminModel: Model<AdminDocument>,
    private adminService: AdminService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.adminService.getUserEmail(email);
    if (user && (await this.hashService.comparePassword(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      userName: user.userName,
      email: user.email,
      userId: user._id,
    };
    const userToken = await this.adminModel.findOne({ _id: user.id });

    const accessToken = this.jwtService.sign(payload);
    userToken.token = accessToken;
    await userToken.save();
    return {
      sucess: true,
      msg: 'Login succesfully',
      access_token: accessToken,
    };
  }

  async getProfile(user: any) {
    try {
      const profile = await this.adminModel
        .findById(user.userId)
        .select({ _id: 1, email: 1, userName: 1 });

      if (!profile) {
        throw new NotAcceptableException("User doesn't exist11");
      }
      return { message: 'User profile', data: profile };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async logout(token) {
    try {
      const payload = this.jwtService.verify(token);
      const userInfo = await this.adminModel.findById(payload.userId);

      if (userInfo) {
        userInfo.token = '';
        await userInfo.save();
        return {
          message: 'Logged out Successfully!!',
          status: 'Successful',
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
