import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../interfaces/role-tyoe.emun';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  username: string;
  @Prop()
  role: UserRole;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  bio: string;
  @Prop()
  image: string;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  token: string;
  _id: any;
}

export const UserSchema = SchemaFactory.createForClass(User);
