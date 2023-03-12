import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/signup')
  @UsePipes(new ValidationPipe())
  createUser(@Body() body: CreateUserDto) {
    console.log('body', body);
  }
}
