import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CategoriaService } from './categorias.service';
import { Category } from '../Entity/Category';

@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  
  @Get()
  getAll(): Category[] {
    return this.categoriaService.getAll();
  }

  @Post()
  createCategory(category: Category): Category {
    
    return this.categoriaService.createCategory(category);
  }

  @Delete()
  deleteCategory(id: number): string {
    this.categoriaService.deleteCategory(id);
    return 'Categoria eliminada con exito.';
  }


  @Put()
  updateCategory(category: Category): Category {
    return this.categoriaService.updateCategory(category);
  }

  
}
