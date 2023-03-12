import { Injectable } from '@nestjs/common';
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
    const createdCat = await this.catModel.create(createCatDto);
    return createdCat;
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
