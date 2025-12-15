import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/Entity/Category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Category)
    private readonly repoCat: Repository<Category>,
  ) {}

  async getAll(): Promise<Category[]> {
    return await this.repoCat.find();
  }


  async getById(id: string): Promise<Category> {
    const category = await this.repoCat.findOneBy({ id });
    if (category !== null) {
      return category;
    } else {
      throw new Error(`La categoria con id:${id} no se encuentra.`);
    }
  }

  async getByName(name: string): Promise<Category[]> {
    return await this.repoCat.find({ where: { name } });
  }

  async createCategory(category: Category): Promise<Category> {
    const newCategory = this.repoCat.create(category);
    await this.repoCat.save(newCategory);
    return newCategory;
  }


  async deleteCategory(id: string): Promise<void> {
    const category = await this.repoCat.findOne({ where: { id } });

    if (category) {
      await this.repoCat.remove(category);
    } else {
      throw new Error(`La categoria con id:${id} no se encuentra.`);
    }
  }

  async updateCategory(id: string, category: Category): Promise<Category> {
    await this.repoCat.save(category);
    return category;
  }

  
}
