import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { UserResponseInterface } from './types/userResponse.interface';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from './decorators/currentUser.decorator';
import { User } from './schemas/user.schema';
import { UserRole } from './interfaces/role-tyoe.emun';

@Controller()
@ApiTags('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/signup')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body() body: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(body);
    return this.userService.buildUserResponse(user);
  }

  @Get('users')
  async getUsers() {
    const users = await this.userService.findAll();
    return users;
  }
}
