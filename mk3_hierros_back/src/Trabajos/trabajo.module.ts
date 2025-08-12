import { Module } from '@nestjs/common';
import { TrabajoController } from './trabajo.controller';
import { TrabajoService } from './trabajo.service';
import { Work } from 'src/Entity/Work.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Work]),],
  controllers: [TrabajoController],
  providers: [TrabajoService],
})
export class TrabajoModule {}
