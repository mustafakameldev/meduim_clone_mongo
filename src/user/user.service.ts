import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comparePassword, hashPassword } from 'src/utils/ecrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/userResponse.interface';
import { JWT_SECRET } from 'src/utils/config';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UserRole } from './interfaces/role-tyoe.emun';
import { LoginDto } from './dtos/login.dto';
import { SearchUsersDto } from './dtos/search-users.dto';
import { SearchUsersInterface } from './types/searchUsersResponse.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(userDto: CreateUserDto) {
    const findByUser = await this.userModel.findOne({
      username: userDto.username,
    });
    if (findByUser) {
      throw new HttpException(
        'Username is used',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const findByEmail = await this.userModel.findOne({ email: userDto.email });
    if (findByEmail) {
      throw new HttpException('email is used', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const newUser = new User();
    Object.assign(newUser, userDto);
    newUser.password = await hashPassword(newUser.password);
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();
    const createUser = await this.userModel.create(newUser);
    const user = await this.userModel.findOne({ _id: createUser._id }).lean();
    delete user.password;
    user._id = user._id.toString();
    return user;
  }

  buildUserResponse(user: User): UserResponseInterface {
    user.token = this.generateJWT(user);
    return user;
  }
  async findOne(userId: string) {
    const user = await this.userModel.findById(userId);
    return user;
  }
  generateJWT(user: User): string {
    return sign(
      {
        _id: user._id,
        username: user.username,
      },
      JWT_SECRET,
    );
  }
  async findAll() {
    return this.userModel.find().exec();
  }

  async removeAll() {
    try {
      this.userModel
        .deleteMany({})
        .then(() => {
          console.log('remove');
        })
        .catch((err) => console.log('err', err));
    } catch (error) {
      console.log('error', error);
    }
  }

  async createAdmin(userDto: CreateAdminDto): Promise<User> {
    const findByUser = await this.userModel.findOne({
      username: userDto.username,
    });
    if (findByUser) {
      throw new HttpException(
        'Username is used',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const findByEmail = await this.userModel.findOne({
      email: userDto.email,
    });
    if (findByEmail) {
      throw new HttpException('email is used', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const newUser = new User();
    Object.assign(newUser, userDto);
    newUser.password = await hashPassword(newUser.password);
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();
    newUser.role = UserRole.admin;
    const user = await this.userModel.create(newUser);
    return user;
  }

  async login(loginDto: LoginDto): Promise<User> {
    const user =
      (await this.userModel
        .findOne({
          username: loginDto.usernameOrEmail,
        })
        .lean()) ||
      (await this.userModel
        .findOne({ email: loginDto.usernameOrEmail })
        .lean());
    if (!user) {
      throw new HttpException(
        'username or password is wrong',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isCorrectPassword = await comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isCorrectPassword) {
      throw new HttpException(
        'username or password is wrong',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    delete user.password;
    user._id = user._id.toString();
    return user;
  }
  async searchUsers(dto: SearchUsersDto): Promise<SearchUsersInterface> {
    const users = await this.getAllUsers(dto);
    return users;
  }

  async getAllUsers(dto: SearchUsersDto): Promise<SearchUsersInterface> {
    const filters: any = {};
    if (typeof dto.searchTerm == 'string') {
      filters['username'] = { $regex: dto.searchTerm, $options: 'i' };
    }
    if (Object.values(UserRole).includes(dto.filterByUserRole)) {
      filters['role'] = dto.filterByUserRole;
    }
    const users = await this.userModel
      .find(filters, 'id username email role bio createdAt updatedAt image')
      .limit(dto.size)
      .skip(dto.offset)
      .lean()
      .exec();

    //TODO: remove mapping user data, and update users query to get data as it mapped
    const usersCount = await this.userModel.find(filters).count();
    return {
      content: users.map((user) => ({
        ...user,
        _id: user._id.toString(),
      })),
      count: usersCount,
    };
  }

  async updateUser(
    updateDto: UpdateUserDto,
    id: string,
  ): Promise<UserResponseInterface> {
    const user = await this.userModel.findOne({ _id: id });
    Object.assign(user, updateDto);
    return await user.save();
  }
}
