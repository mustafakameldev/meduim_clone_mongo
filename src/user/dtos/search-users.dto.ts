import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../interfaces/role-tyoe.emun';

export class SearchUsersDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  searchTerm: string;
  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole })
  @IsOptional()
  filterByUserRole: UserRole;
  @IsNumber()
  @ApiProperty()
  size: number;
  @IsNumber()
  @ApiProperty()
  offset: number;
}
