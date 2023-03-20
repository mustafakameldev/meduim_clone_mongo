import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
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
import { CreateAdminDto } from './dtos/create-admin.dto';
import { LoginDto } from './dtos/login.dto';
import MongooseClassSerializerInterceptor from './interceptors/serialize.interceptor';
import { SearchUsersDto } from './dtos/search-users.dto';
import { SearchUsersInterface } from './types/searchUsersResponse.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller()
@ApiTags('auth')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
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
    return users.map((user) => ({ ...user, _id: user._id.toString() }));
  }

  @Post('auth/admin')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createAdmin(
    @Body() body: CreateAdminDto,
    @CurrentUser() user: User,
  ): Promise<User> {
    if (user.role != UserRole.superAdmin) {
      throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);
    }
    const newUser = await this.userService.createAdmin(body);
    return newUser;
  }

  @Post('auth/login')
  @UsePipes(new ValidationPipe())
  async login(@Body() body: LoginDto): Promise<User> {
    const user = await this.userService.login(body);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/search')
  @UsePipes(new ValidationPipe())
  async searchUsers(
    @Body() body: SearchUsersDto,
    @CurrentUser() currentUser: User,
  ): Promise<SearchUsersInterface> {
    if (
      currentUser?.role == UserRole.admin ||
      currentUser?.role == UserRole.superAdmin
    ) {
      return await this.userService.searchUsers(body);
    } else {
      throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);
    }
  }
  @Patch('users/update/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Body() body: UpdateUserDto,
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<User> {
    if (id == user._id.toString()) {
      return await this.userService.updateUser(body, id);
    }
    throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);
  }
  @Delete('users/:id')
  @UseGuards(AuthGuard)
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ): Promise<{ message: string }> {
    if (
      currentUser?.role == UserRole.admin ||
      currentUser?.role == UserRole.superAdmin
    ) {
      return this.userService.deleteUser(id);
    }
    throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);
  }
  @Patch('users/activate')
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe())
  async activateUser(@Body('id') id: string, @CurrentUser() currentUser: User) {
    return this.userService.toggleActiveUser(id);
  }
}
