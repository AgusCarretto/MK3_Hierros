import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/Entity/Category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Category)
    private readonly repo_cat: Repository<Category>,
  ) {}

  async getAll(): Promise<Category[]> {
    return await this.repo_cat.find();
  }

  async getById(id: number): Promise<Category> {
    const category = await this.repo_cat.findOneBy({ id });
    if (category !== null) {
      return category;
    } else {
      throw new Error(`La categoria con id:${id} no se encuentra.`);
    }
  }

  async getByName(name: string): Promise<Category[]> {
    return await this.repo_cat.find({ where: { name } });
  }

  async createCategory(category: Category): Promise<Category> {
    const newCategory = this.repo_cat.create(category);
    await this.repo_cat.save(newCategory);
    return newCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.repo_cat.findOne({ where: { id } });
    if (category) {
      await this.repo_cat.remove(category);
    } else {
      throw new Error(`La categoria con id:${id} no se encuentra.`);
    }
  }
  async updateCategory(category: Category): Promise<Category> {
    await this.repo_cat.save(category);
    return category;
  }

  
}
