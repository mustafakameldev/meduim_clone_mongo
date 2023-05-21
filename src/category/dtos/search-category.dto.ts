import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsMongoId } from 'class-validator';

export class SearchCategoriesDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  searchTerm: string;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  size: number;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  price: number;
  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  filterByUser: string;
}
