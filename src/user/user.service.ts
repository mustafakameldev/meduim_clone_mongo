import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashPassword } from 'src/utils/ecrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/userResponse.interface';
import { JWT_SECRET } from 'src/utils/config';
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
    return await this.userModel.create(newUser);
  }

  buildUserResponse(user: User): UserResponseInterface {
    user.token = this.generateJWT(user);
    return user;
  }
  generateJWT(user: User): string {
    return sign(
      {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      JWT_SECRET,
    );
  }
  async findAll() {
    return this.userModel.find().exec();
  }
}
