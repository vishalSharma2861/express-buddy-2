import { AuthService } from 'src/auth/auth.service';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('object');
    if (!email || !password) {
      throw new BadRequestException({
        message: 'Please provide both email and passwordzzz',
      });
    }
    const user = await this.authService.validateUser(email, password);
    console.log('user', user);
    if (!user) {
      throw new BadRequestException({
        message: 'You have entered a wrong email or password',
      });
    }
    return user;
  }
}
