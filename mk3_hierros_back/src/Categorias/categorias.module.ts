import { Module } from '@nestjs/common';
import { CategoriaController } from './categorias.controller';
import { CategoriaService } from './categorias.service';

@Module({
  imports: [],
  controllers: [CategoriaController],
  providers: [CategoriaService],
})
export class CategoriaModule {}
