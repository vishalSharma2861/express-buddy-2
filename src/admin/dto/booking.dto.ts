import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { BOOKING_STATUS } from '../enum/booking.enum';

export class BookingQueryDto {
  @IsOptional()
  @IsString()
  page: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsEnum(BOOKING_STATUS)
  status: any;

  @IsOptional()
  @IsString()
  bookingType: string;
}
