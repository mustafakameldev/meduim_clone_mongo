import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
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
  @Exclude()
  password?: string;
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
  _id: string;
  @Prop({ default: false })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ username: 'text', role: 'text', bio: 'text' });
