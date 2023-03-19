import { IsOptional, IsString, IsEnum, IsEmail } from 'class-validator';
import { UserRole } from '../interfaces/role-tyoe.emun';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username: string;
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
  @IsEmail()
  @IsOptional()
  email: string;
  @IsOptional()
  @IsString()
  bio: string;
  @IsString()
  @IsOptional()
  image: string;
}
