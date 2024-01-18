import { AuthService } from './auth.service';
import {
  Controller,
  Request,
  UseGuards,
  Post,
  Get,
  Headers,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from 'src/admin/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(AuthGuard('local'))
  // @Post('login')
  // async login(@Request() req) {
  //   return this.authService.login(req.user);
  // }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async userProfile(@Request() req) {
    const { user } = req;
    console.log('user', user);
    return this.authService.getProfile(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async userLogout(@Request() req, @Headers() headers) {
    const { user } = req;
    console.log('userLogout', user);
    const { authorization } = headers;
    const token = authorization.split(' ')[1];
    if (token) {
      return await this.authService.logout(token);
    }
  }
}
