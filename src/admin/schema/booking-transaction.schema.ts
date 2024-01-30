import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BookingModel } from './booking.schema';
import {
  PAYMENT_TRANSACTION_STATUS,
  PAYMENT_TRANSACTION_TYPE,
} from '.././enum/payment.enum';
import { UserModel } from './user.schema';

export type BookingTransactionDocument = BookingTransactionModel & Document;

@Schema({ timestamps: true })
export class BookingTransactionModel {
  @Prop({ required: true })
  piId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: BookingModel.name,
  })
  bookingId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: BookingModel.name,
  })
  dueId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserModel.name,
    required: true,
  })
  createdBy: mongoose.Types.ObjectId;

  @Prop({ default: '' })
  status: string;

  @Prop({ default: 0 })
  capturedAmount: number;

  @Prop({ default: 0 })
  initialAmount: number;

  @Prop({
    enum: PAYMENT_TRANSACTION_STATUS,
    default: PAYMENT_TRANSACTION_STATUS.INCOMPLETE,
  })
  paymentStatus: PAYMENT_TRANSACTION_STATUS;

  @Prop({ default: PAYMENT_TRANSACTION_TYPE.BOOKING })
  transactionType: PAYMENT_TRANSACTION_TYPE;
}

export const BookingTransactionSchema = SchemaFactory.createForClass(
  BookingTransactionModel,
);
