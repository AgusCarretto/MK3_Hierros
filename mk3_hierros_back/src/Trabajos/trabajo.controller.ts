import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { TrabajoService } from './trabajo.service';
import { Work } from 'src/Entity/Work';

@Controller('trabajo')
export class TrabajoController {
  constructor(private readonly trabajoService: TrabajoService) {}


  
  @Get()
  getAll(): Work[] {
    return this.trabajoService.getAll();
  }

  @Post()
  createWork(work: Work): Work {
    return this.trabajoService.createWork(work);
  }

  @Delete()
  deleteWork(id: number): string {
    this.trabajoService.deleteWork(id);
    return 'Trabajo eliminado con exito.';
  }


  @Put()
  updateWork(work: Work): Work {
    return this.trabajoService.updateWork(work);
  }


}


