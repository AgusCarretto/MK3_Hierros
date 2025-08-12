import { Module } from '@nestjs/common';
import { CategoriaController } from './categorias.controller';
import { CategoriaService } from './categorias.service';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa TypeOrmModule
import { Category } from '../Entity/Category.entity'; // Importa la entidad

@Module({
  imports: [TypeOrmModule.forFeature([Category]),],
  controllers: [CategoriaController],
  providers: [CategoriaService],
})
export class CategoriaModule {}
