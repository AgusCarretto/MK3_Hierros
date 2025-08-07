import { Controller, Get } from '@nestjs/common';
import { TrabajoService } from './trabajo.service';

@Controller('trabajo')
export class TrabajoController {
  constructor(private readonly trabajoService: TrabajoService) {}


  @Get()
  getHello(): string {
    return this.trabajoService.getHello();
  }
}

