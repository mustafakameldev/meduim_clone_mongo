import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './schemas/category.schema';

@Controller('categories')
export class CategoryController {
  constructor(private readonly catsService: CategoryService) {}

  @Post()
  async create(@Body() createCatDto: CreateCategoryDto) {
    await this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.catsService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.catsService.delete(id);
  }
}
