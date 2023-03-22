import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './schemas/category.schema';
import { ApiTags } from '@nestjs/swagger';
import { AuthorGuard } from 'src/guards/author.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/user/decorators/currentUser.decorator';
import { User } from 'src/user/schemas/user.schema';
import { UserRole } from 'src/user/interfaces/role-tyoe.emun';

@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private readonly catsService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createCatDto: CreateCategoryDto,
    @CurrentUser() user: User,
  ) {
    if (user?.role != UserRole.customer) {
      return await this.catsService.create(createCatDto);
    }
    throw new HttpException(
      'Not authorized to create category',
      HttpStatus.FORBIDDEN,
    );
  }

  // @Get()
  // async findAll(): Promise<Category[]> {
  //   return this.catsService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<Category> {
  //   return this.catsService.findOne(id);
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   return this.catsService.delete(id);
  // }
}
