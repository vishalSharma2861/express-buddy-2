import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { LocalStrategy } from 'src/strategy/local.strategy';
import { AdminService } from 'src/admin/admin.service';
import { HashService } from 'src/admin/hash.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModel, AdminSchema } from 'src/admin/schema/admin.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'src/config/config.service';

import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: ConfigService.keys.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forFeature([
      {
        name: AdminModel.name,
        schema: AdminSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminService,
    LocalStrategy,
    HashService,
    JwtStrategy,
  ],
})
export class AuthModule {}
