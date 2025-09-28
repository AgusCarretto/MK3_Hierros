import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { TrabajoService } from './trabajo.service';
import { Priority, Status, Work } from 'src/Entity/Work.entity';
import { UpdateWorkDto } from './dto/updateWork.dto';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { WorkImageService } from './workImage.service';

@Controller('trabajo')
export class TrabajoController {
  constructor(
    private readonly trabajoService: TrabajoService,
    private readonly workImageService: WorkImageService,
  ) {}

  @Get()
  async getAll(): Promise<Work[]> {
    return await this.trabajoService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Work> {
    return await this.trabajoService.getById(id);
  }

  @Get('byCategory/:categoryId')
  async getByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Work[]> {
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
  async deleteWork(@Param('id') id: string): Promise<string> {
    await this.trabajoService.deleteWork(id);
    return 'Trabajo eliminado con exito.';
  }

  @Put('/:id')
  async updateWork(
    @Param('id') id: string,
    @Body() work: UpdateWorkDto,
  ): Promise<Work> {
    return await this.trabajoService.updateWork(id, work);
  }

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImages(
    @Param('id') workId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('No se proporcionaron imágenes', HttpStatus.BAD_REQUEST);
    }

    // Validar archivos
    for (const file of files) {
      if (!file.mimetype.startsWith('image/')) {
        throw new HttpException(`${file.originalname} no es una imagen válida`, HttpStatus.BAD_REQUEST);
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new HttpException(`${file.originalname} supera los 5MB`, HttpStatus.BAD_REQUEST);
      }
    }

    return await this.workImageService.uploadImages(workId, files);
  }

  // Obtener imagen específica
  @Get(':id/images/:imageId')
  async getWorkImage(
    @Param('imageId') imageId: string,
    @Res() res: Response
  ) {
    const imageData = await this.workImageService.getImageById(imageId);
    
    if (!imageData) {
      return res.status(404).send('Imagen no encontrada');
    }

    res.set({
      'Content-Type': imageData.imageMimeType,
      'Content-Disposition': `inline; filename="${imageData.imageName}"`
    });
    
    return res.send(imageData.imageData);
  }

  // Obtener metadatos de imágenes
  @Get(':id/images')
  async getWorkImages(@Param('id') workId: string) {
    return await this.workImageService.getWorkImages(workId);
  }

  // Eliminar imagen
  @Delete('/images/:imageId')
  async deleteImage(@Param('imageId') imageId: string) {
    await this.workImageService.deleteImage(imageId);
    return { message: 'Imagen eliminada' };
  }
}
