import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoriaService } from './categorias.service';
import { Category } from '../Entity/Category.entity';

@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Get()
  async getAll(): Promise<Category[]> {
    return await this.categoriaService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Category> {
    return await this.categoriaService.getById(id);
  }

  @Get('byName/:name')
  async getByName(@Param('name') name: string): Promise<Category[]> {
    return await this.categoriaService.getByName(name);
  }

  @Post()
  async createCategory(@Body() category: Category): Promise<Category> {
    return await this.categoriaService.createCategory(category);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    await this.categoriaService.deleteCategory(id);
  }

  @Put()
  async updateCategory(@Param('id') id: string, @Body() category: Category): Promise<Category> {
    return await this.categoriaService.updateCategory(id, category);
  }
}
