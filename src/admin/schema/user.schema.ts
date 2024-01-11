import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { vehicleType } from '../enum/user.enum';
// import * as mongoose from 'mongoose';

export type UserDocument = UserModel & Document;

@Schema({ timestamps: true })
export class UserModel {
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
  carPlateNumber: string;

  @Prop({ enum: vehicleType })
  vehicleType: string;

  @Prop({ default: false })
  isProfileCompleted: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ default: '' })
  customerId: string;

  @Prop({})
  firebaseUid: string;

  @Prop({ default: 0 })
  balance: number;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
