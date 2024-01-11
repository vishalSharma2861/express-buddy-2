import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { SignupDto } from './dto/signup.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  registerUser(@Body() dto: SignupDto) {
    return this.adminService.registerAdmin(dto);
  }
}
