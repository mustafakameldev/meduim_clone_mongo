import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly catModel: Model<CategoryDocument>,
  ) {}

  async create(createCatDto: CreateCategoryDto, user: User): Promise<Category> {
    const find = await this.catModel.findOne({ name: createCatDto.name });
    if (find) {
      throw new HttpException(
        'Category already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const category = new Category();
    Object.assign(category, createCatDto);

    category.createdAt = new Date();
    category.updatedAt = new Date();
    category.user = user;
    const createdCat = await this.catModel.create(category);
    const response = createdCat.toJSON();
    delete response['__v'];
    return response;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.catModel.findById(id);
    if (!category)
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    Object.assign(category, updateCategoryDto);
    category.updatedAt = new Date();
    const updatedCat = (await category.save()).toJSON();
    delete updatedCat['__v'];
    return updatedCat;
  }
  async findAll(): Promise<Category[]> {
    return this.catModel
      .find(undefined, 'name createdAt updatedAt')
      .populate('user')
      .exec();
  }

  async findOne(id: string): Promise<Category> {
    return this.catModel.findOne({ _id: id }).exec();
  }

  async delete(id: string) {
    const deletedCat = await this.catModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedCat;
  }
}
