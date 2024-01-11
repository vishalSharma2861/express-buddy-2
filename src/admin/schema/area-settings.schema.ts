import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type AreaSettingsDocument = AreaSettingsModel & Document;

class DaySurgeTimingSchema {
  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({
    required: true,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  })
  day: string;
}

class DriverCommissionTimingSchema {
  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true })
  normal: number;

  @Prop({ required: true })
  priority: number;
}

@Schema()
export class Polygon {
  @Prop({ type: String, enum: ['Polygon'], required: true })
  type: string;

  @Prop({ type: [[[Number]]], required: true })
  coordinates: number[][][];
}

export const PolygonSchema = SchemaFactory.createForClass(Polygon);

@Schema({ timestamps: true })
export class AreaSettingsModel {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  normalCharge: number;

  @Prop({ required: true })
  tip: number;

  @Prop({ required: true })
  priorityCharge: number;

  @Prop({ required: true })
  normalSurge: number;

  @Prop({ required: true })
  prioritySurge: number;

  @Prop({ required: true })
  delayChargePublicHoliday: number;

  @Prop({ required: true })
  driverPublicHolidayCommission: number;

  @Prop({ required: true })
  additionalCharge: number;

  @Prop({ required: true })
  surCharge: number;

  @Prop({ required: true })
  cancelationCharge: number;

  @Prop({ required: true })
  noShowCharge: number;

  @Prop({ required: true })
  delayCharge: number;

  @Prop({ required: true })
  timezone: string[];

  @Prop()
  holidays: string[];

  @Prop({ default: true })
  isSunday: boolean;

  // in min
  @Prop({ default: 30 })
  delayBuffer: number;

  // in min
  @Prop({ default: 30 })
  earlyBuffer: number;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  adhocSurgeTime: Record<string, any>;

  @Prop({ default: 10 })
  adhocSurgeCharge: number;

  @Prop({ required: true, type: () => DaySurgeTimingSchema })
  daySurgeTiming: Record<string, DaySurgeTimingSchema>;

  @Prop({ default: [], type: [[[Number]]] })
  surgeArea: number[][][];

  @Prop({ default: 10 })
  surgeAreaCharge: number;

  @Prop({ type: PolygonSchema, required: true })
  area: Polygon;

  @Prop({ required: true, type: () => DriverCommissionTimingSchema })
  driverCommissionTiming: DriverCommissionTimingSchema[];
}

export const AreaSettingsSchema =
  SchemaFactory.createForClass(AreaSettingsModel);
