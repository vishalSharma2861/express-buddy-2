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
import * as bcrypt from 'bcrypt';

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

  // async login(dto) {
  //   try {
  //     const { email, password } = dto;
  //     console.log('email', email);
  //     console.log('password', password);
  //     const userToken = await this.adminModel.findOne({ email: email });
  //     console.log('userToken', userToken);
  //     if (!userToken) {
  //       throw new NotAcceptableException('Invalid email or password');
  //     }
  //     const passwordValid = await this.hashService.comparePassword(
  //       password,
  //       userToken.password,
  //     );
  //     console.log('passwordValid', passwordValid);

  //     if (userToken && passwordValid) {
  //       const payload = {
  //         userName: userToken.userName,
  //         email: userToken.email,
  //         userId: userToken._id,
  //       };

  //       const accessToken = this.jwtService.sign(payload);
  //       userToken.token = accessToken;
  //       await userToken.save();

  //       return {
  //         sucess: true,
  //         msg: 'Login succesfully',
  //         access_token: accessToken,
  //       };
  //     } else {
  //       throw new NotAcceptableException('Invalid email or password');
  //     }
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }

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
