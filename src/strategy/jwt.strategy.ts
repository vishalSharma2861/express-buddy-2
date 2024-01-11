import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { AdminDocument, AdminModel } from 'src/admin/schema/admin.schema';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(AdminModel.name) private adminModel: Model<AdminDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.keys.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.adminModel.findById({ _id: payload.userId });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.token === '') {
      throw new UnauthorizedException();
    }

    return {
      userId: user._id,
      userName: user.userName,
      email: user.email,
    };
  }
}
