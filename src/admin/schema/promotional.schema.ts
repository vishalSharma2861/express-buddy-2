import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ASSIGN_TYPE,
  LIMIT_TYPE,
  PROMOTIONAL_TYPE,
} from '../enum/promotional.enum';
import * as mongoose from 'mongoose';
import { UserModel } from './user.schema';
import { AreaSettingsModel } from './area-settings.schema';

export type PromotionalDocument = PromotionalModel & Document;

@Schema({ timestamps: true })
export class PromotionalModel {
  @Prop({ required: true })
  value: number;

  @Prop()
  maxAmount: number;

  @Prop({
    enum: LIMIT_TYPE,
    default: LIMIT_TYPE.UNLIMITED,
  })
  limitType: LIMIT_TYPE;

  @Prop()
  limit: number;

  @Prop()
  remainingUsed: number;

  @Prop({ required: true })
  code: string;

  @Prop()
  description: string;

  @Prop({
    enum: PROMOTIONAL_TYPE,
    default: PROMOTIONAL_TYPE.AMOUNT,
  })
  type: PROMOTIONAL_TYPE;

  @Prop({ required: true })
  startAt: number;

  @Prop({ required: true })
  expiredAt: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: UserModel.name,
  })
  assignedFor: mongoose.Types.ObjectId[];

  @Prop({
    enum: ASSIGN_TYPE,
    default: ASSIGN_TYPE.ALL,
  })
  assignType: ASSIGN_TYPE;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: AreaSettingsModel.name,
    required: true,
  })
  area: mongoose.Types.ObjectId[];

  @Prop()
  image: string;

  @Prop({ default: false })
  homeSelect: boolean;

  @Prop({ default: false })
  isDeactivated: boolean;

  @Prop()
  title: string;
}

export const PromotionalSchema = SchemaFactory.createForClass(PromotionalModel);
