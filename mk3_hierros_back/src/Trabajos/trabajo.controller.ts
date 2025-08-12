import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TrabajoService } from './trabajo.service';
import { Priority, Status, Work } from 'src/Entity/Work.entity';

@Controller('trabajo')
export class TrabajoController {
  constructor(private readonly trabajoService: TrabajoService) {}

  @Get()
  async getAll(): Promise<Work[]> {
    return await this.trabajoService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<Work> {
    return await this.trabajoService.getById(id);
  }

  @Get('byCategory/:categoryId')
  async getByCategory(
    @Param('categoryId') categoryId: number): Promise<Work[]> {
    return await this.trabajoService.getByCategory(categoryId);
  }

  @Get('byPriority/:priority')
  async getByPriority(@Param('priority') priority: Priority): Promise<Work[]> {
    return await this.trabajoService.getByPriority(priority);
  }

  @Get('byStatus/:status')
  async getByStatus(@Param('status') status: Status): Promise<Work[]> {
    return await this.trabajoService.getByStatus(status);
  }

  @Post()
  async createWork(@Body() work: Work): Promise<Work> {
    return await this.trabajoService.createWork(work);
  }

  @Delete(':id')
  async deleteWork(@Param('id') id: number): Promise<string> {
    await this.trabajoService.deleteWork(id);
    return 'Trabajo eliminado con exito.';
  }

  @Put()
  async updateWork(@Body() work: Work): Promise<Work> {
    return await this.trabajoService.updateWork(work);
  }
}
