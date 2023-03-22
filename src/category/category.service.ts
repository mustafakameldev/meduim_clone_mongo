import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly catModel: Model<CategoryDocument>,
  ) {}

  async create(createCatDto: CreateCategoryDto): Promise<Category> {
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
    const createdCat = await this.catModel.create(category);
    const response = createdCat.toJSON();
    delete response['__v'];
    return response;
  }

  async updateCategory(category: Category): Promise<Category> {
    return '' as any;
  }
  async findAll(): Promise<Category[]> {
    return this.catModel.find().exec();
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
