import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { accountStatus, licenseType } from '../enum/driver.enum';

export type DriverDocument = DriverModel & Document;

@Schema({ timestamps: true })
export class DriverModel {
  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  phoneCode: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  nameAsInBankAccount: string;

  @Prop()
  bankName: string;

  @Prop()
  bankAccountNumber: string;

  @Prop({ enum: licenseType })
  licenseType: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bookingmodels',
  })
  currentOngoingBooking: [mongoose.Types.ObjectId];

  @Prop({ default: false })
  isProfileCompleted: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ enum: accountStatus, default: accountStatus.PENDING })
  accountStatus: string;

  @Prop({ default: false, type: Boolean })
  status: boolean;

  @Prop({ required: true, unique: true })
  driverId: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 0 })
  totalEarning: number;

  @Prop({ default: 0 })
  totalTrip: number;

  @Prop({ default: 0 })
  lastCashGiven: number;

  @Prop({ default: 0 })
  cashToSubmit: number;

  @Prop({})
  firebaseUid: string;

  @Prop()
  dl_f: string;

  @Prop()
  dl_b: string;

  @Prop()
  nric_f: string;

  @Prop()
  nric_b: string;
}

export const DriverSchema = SchemaFactory.createForClass(DriverModel);
