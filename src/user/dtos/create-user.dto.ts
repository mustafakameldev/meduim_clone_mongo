import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../interfaces/role-tyoe.emun';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
