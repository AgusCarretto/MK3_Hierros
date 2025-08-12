import { Injectable } from '@nestjs/common';
import { Category } from 'src/Entity/Category';




@Injectable()
export class CategoriaService {
  getAll(): Category[] {
    return [{'id': 1 ,'name': 'Rejas'},{'id': 1 ,'name': 'Portones'},{'id': 1 ,'name': 'Puertas'}]; //return all pelotudito
  }

  createCategory(category: Category): Category {
    
    const newCategory = new Category();
    newCategory.name = category.name;
    
    //aca guardar la nueva categoria en la base de datos calculo yo

    return category; 
  }


  deleteCategory(id: number): void {
   
    //encontrar por id la categoria y eliminarla
      
  }
  

  updateCategory(category: Category): Category {

    //logica para encontrar la categoria por id y actualizarla

    return category;

  }








  
}

