import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AdminDocument = AdminModel & Document;

@Schema({ timestamps: true })
export class AdminModel {
  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  token: string;
}

export const AdminSchema = SchemaFactory.createForClass(AdminModel);
