import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
export class ActivateUserDto {
  @IsMongoId()
  @IsString()
  @ApiProperty()
  id: string;
}
