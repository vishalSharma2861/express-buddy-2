import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './config/config.service';
import { AdminModule } from './admin/admin.module';

import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { PaginationModule } from './pagination/pagination.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: ConfigService.keys.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule,
    MongooseModule.forRoot(ConfigService.keys.MONGO_URL),
    AdminModule,
    AuthModule,
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
