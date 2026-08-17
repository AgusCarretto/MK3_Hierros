import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import sharp from 'sharp';
import { WorkImage } from '../Entity/WorkImage.entity';
import { Work } from '../Entity/Work.entity';

const THUMBNAIL_WIDTH = 480;
const THUMBNAIL_JPEG_QUALITY = 75;

@Injectable()
export class WorkImageService {
  constructor(
    @InjectRepository(WorkImage)
    private readonly workImageRepo: Repository<WorkImage>,
    @InjectRepository(Work)
    private readonly workRepo: Repository<Work>,
  ) {}

  async uploadImages(
    workId: string,
    files: Express.Multer.File[],
  ): Promise<WorkImage[]> {
    const work = await this.workRepo.findOneBy({ id: workId });
    if (!work) {
      throw new Error(`Trabajo con id ${workId} no encontrado`);
    }

    // Obtener el orden actual máximo
    const maxOrder = await this.workImageRepo
      .createQueryBuilder('image')
      .select('MAX(image.order)', 'max')
      .where('image.work = :workId', { workId })
      .getRawOne();

    let currentOrder = (maxOrder?.max || 0) + 1;

    const savedImages: WorkImage[] = [];

    for (const file of files) {
      const workImage = this.workImageRepo.create({
        work,
        imageData: file.buffer,
        imageName: file.originalname,
        imageMimeType: file.mimetype,
        order: currentOrder++,
      });

      const saved = await this.workImageRepo.save(workImage);
      savedImages.push(saved);
    }

    return savedImages;
  }

  async getWorkImages(workId: string): Promise<WorkImage[]> {
    return await this.workImageRepo.find({
      where: { work: { id: workId } },
      order: { order: 'ASC' },
      select: ['id', 'imageName', 'imageMimeType', 'order', 'uploadedAt'],
    });
  }

  async getImageById(imageId: string): Promise<WorkImage | null> {
    return await this.workImageRepo.findOne({
      where: { id: imageId },
      select: ['imageData', 'imageName', 'imageMimeType'],
    });
  }

  // Miniatura on-demand: reusa la misma lectura de imageData y la
  // redimensiona al vuelo. Sin persistencia (ver docs/analysis/2026-08-17_works-images-performance.md,
  // Option A) — el costo de CPU es despreciable frente a la latencia de
  // red/DB ya presente, y Cache-Control: immutable evita recalcularla más
  // de una vez por visitante.
  async getThumbnailById(imageId: string): Promise<Buffer | null> {
    const image = await this.getImageById(imageId);
    if (!image) return null;

    return sharp(image.imageData)
      .resize({ width: THUMBNAIL_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: THUMBNAIL_JPEG_QUALITY, mozjpeg: true })
      .toBuffer();
  }

  async deleteImage(imageId: string): Promise<void> {
    await this.workImageRepo.delete(imageId);
  }
}
