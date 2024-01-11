import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { DriverModel } from './driver.schema';
import { UserModel } from './user.schema';

import {
  BOOKING_STATUS,
  BOOKING_TYPE,
  PAYMENT_TYPE,
  VELET_TYPE,
} from '../enum/booking.enum';
import { AreaSettingsModel } from './area-settings.schema';
import { PromotionalModel } from './promotional.schema';

const coordinateSchema = {
  latitude: { type: Number },
  longitude: { type: Number },
  name: { type: String },
  address: { type: String },
};

export type BookingDocument = BookingModel & Document;

@Schema()
class OtherAmountsSchema {
  @Prop({ default: 0 })
  cancelationCharge: number;

  @Prop({ default: 0 })
  prioritySurge: number;

  @Prop({ default: 0 })
  normalSurge: number;

  @Prop({ default: 0 })
  driverCommission: number;

  @Prop({ default: 0 })
  areaSurge: number;

  @Prop({ default: 0 })
  adhocSurge: number;

  @Prop({ default: 0 })
  additionalStopCharge: number;

  @Prop({ default: 0 })
  noShowCharge: number;

  @Prop({ default: 0 })
  delayCharge: number;

  @Prop()
  reason: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: AreaSettingsModel.name,
    required: true,
  })
  area: mongoose.Types.ObjectId;
}

@Schema()
class PromotionalSchema {
  @Prop({ default: '' })
  promotionalCode: string;

  @Prop({ default: 0 })
  promotionalAmount: number;

  @Prop({ default: 0 })
  promotionalValue: number;

  @Prop({ default: '' })
  promotionalType: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: PromotionalModel.name,
    required: true,
  })
  promotionalId: mongoose.Types.ObjectId;
}

@Schema({ timestamps: true })
export class BookingModel {
  // !----------- simple details

  @Prop({ required: true, enum: BOOKING_TYPE, default: BOOKING_TYPE.NOW })
  BookingType: BOOKING_TYPE;

  @Prop({ required: true })
  BookingAt: number;

  @Prop()
  finishedAt: number;

  @Prop({ required: true, unique: true })
  BookingId: number;

  @Prop()
  note: string;

  @Prop()
  adminNote: string;

  @Prop({ required: true, enum: VELET_TYPE, default: VELET_TYPE.NORMAL })
  veletType: VELET_TYPE;

  @Prop({ required: true, enum: PAYMENT_TYPE, default: PAYMENT_TYPE.CASH })
  paymentType: PAYMENT_TYPE;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserModel.name,
    required: true,
  })
  createdBy: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DriverModel.name,
  })
  assignedTo: mongoose.Types.ObjectId;

  @Prop({
    enum: BOOKING_STATUS,
    default: BOOKING_STATUS.PENDING,
    required: true,
  })
  status: BOOKING_STATUS;

  @Prop()
  arrivedAt: number;

  // !-----------location coords

  @Prop({
    required: true,
    type: coordinateSchema,
  })
  startPoint: typeof coordinateSchema;

  @Prop({
    required: true,
    type: coordinateSchema,
  })
  endPoint: typeof coordinateSchema;

  @Prop({
    type: [coordinateSchema],
    default: [],
  })
  otherPoints: (typeof coordinateSchema)[];

  // !-------- amount details

  @Prop()
  totalPayableAmount: number;

  @Prop()
  totalAmount: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 0 })
  tip: number;

  @Prop({ default: 0 })
  cancelationCharge: number;

  @Prop({ default: 0 })
  delayCharge: number;

  @Prop({ type: Boolean })
  amountReceived: boolean;

  @Prop({ type: Boolean, default: false })
  paymentFailed: boolean;

  @Prop()
  paymentFailedAt: number;

  @Prop({ default: 0 })
  amountPending: number;

  @Prop({ type: OtherAmountsSchema })
  otherAmounts: OtherAmountsSchema;

  @Prop({ type: PromotionalSchema })
  promotional: PromotionalSchema;
}

export const BookingSchema = SchemaFactory.createForClass(BookingModel);
