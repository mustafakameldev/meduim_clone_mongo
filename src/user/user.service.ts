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
    const user = await this.userModel.create(newUser);
    delete user['password'];
    return user;
  }

  buildUserResponse(user: User): UserResponseInterface {
    user.token = this.generateJWT(user);
    return user;
  }
  async findOne(userId: string) {
    return await this.userModel.findOne({ _id: userId });
  }
  generateJWT(user: User): string {
    return sign(
      {
        id: user._id,
      },
      JWT_SECRET,
    );
  }
  async findAll() {
    return this.userModel.find().exec();
  }

  async removeAll() {
    // try {
    //   this.userModel
    //     .deleteMany({})
    //     .then(() => {
    //       console.log('remove');
    //     })
    //     .catch((err) => console.log('err', err));
    // } catch (error) {
    //   console.log('sdfsf', error);
    // }
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
    delete user['password'];
    return user;
  }
  async login(loginDto: LoginDto): Promise<User> {
    const user =
      (await this.userModel.findOne({
        username: loginDto.usernameOrEmail,
      })) ||
      (await this.userModel.findOne({ email: loginDto.usernameOrEmail }));
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
    return user;
  }
}
