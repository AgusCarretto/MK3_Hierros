import { Module } from '@nestjs/common';
import { TrabajoController } from './trabajo.controller';
import { TrabajoService } from './trabajo.service';
import { Work } from '../Entity/Work.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { WorkImageService } from './workImage.service';
import { WorkImage } from '../Entity/WorkImage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Work, WorkImage]),
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    })
  ],
  controllers: [TrabajoController],
  providers: [TrabajoService, WorkImageService],
})
export class TrabajoModule {}
