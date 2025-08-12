import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriaController } from './Categorias/categorias.controller';
import { CategoriaService } from './Categorias/categorias.service';
import { TrabajoController } from './Trabajos/trabajo.controller';
import { TrabajoService } from './Trabajos/trabajo.service';



@Module({
  imports: [
  // TypeOrmModule.forRoot({
  //     type: 'mysql', //Esto en realidad va a ser postgres
  //     host: 'localhost',
  //     port: 3306,
  //     username: 'root',
  //     password: 'root',
  //     database: 'test',
  //     entities: [],
  //     synchronize: true,
  //   }),
  ],
  controllers: [AppController, CategoriaController, TrabajoController],
  providers: [AppService, CategoriaService, TrabajoService],
})
export class AppModule {}
