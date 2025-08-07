import { Injectable } from '@nestjs/common';
import { Category } from 'src/Entity/Category';




@Injectable()
export class CategoriaService {
  getAll(): Category[] {
    return [{'id': 1 ,'name': 'Category 1'}];
  }
}
