import { Injectable } from '@nestjs/common';
import { Work } from '../Entity/Work';




@Injectable()
export class TrabajoService {
 
  getAll(): Work[] {
    return [{'id': 1, 'name': 'Trabajo 1', 'description': 'Descripcion del trabajo 1', 'dateStart': new Date()}]; //return all trabajos
  }

  createWork(work: Work): Work {
    const newWork = new Work();
    newWork.name = work.name;
    newWork.description = work.description;
    newWork.dateStart = work.dateStart;

   //Guardar newWork en la base de datos

    return newWork; 
  }

  deleteWork(id: number): void {
   
    //logica para encontrar el trabajo por id y eliminarlo

  }

  updateWork(work: Work): Work {
    
    //logica para encontrar el trabajo por id y actualizarlo

    return work;
  }
  
 
}
