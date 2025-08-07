import { Module } from '@nestjs/common';
import { TrabajoController } from './trabajo.controller';
import { TrabajoService } from './trabajo.service';

@Module({
  imports: [],
  controllers: [TrabajoController],
  providers: [TrabajoService],
})
export class TrabajoModule {}
