import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriaController } from './Categorias/categorias.controller';
import { CategoriaService } from './Categorias/categorias.service';
import { TrabajoController } from './Trabajos/trabajo.controller';
import { TrabajoService } from './Trabajos/trabajo.service';
import { CategoriaModule } from './Categorias/categorias.module';
import { Priority, Status, Work } from './Entity/Work.entity';
import { TrabajoModule } from './Trabajos/trabajo.module';
import { DataSource } from 'typeorm';
import { Category } from './Entity/Category.entity';
import { WorkImage } from './Entity/WorkImage.entity';
import { WorkImageService } from './Trabajos/workImage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Work, WorkImage]),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('PGHOST'),
          port: configService.get<number>('PGPORT'),
          username: configService.get<string>('PGUSER'),
          password: configService.get<string>('PGPASSWORD'),
          database: configService.get<string>('PGDATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // Esto no se usa en producción.
        };
      },
    }),
    CategoriaModule,
    TrabajoModule,
  ],
  controllers: [AppController, CategoriaController, TrabajoController],
  providers: [AppService, CategoriaService, TrabajoService, WorkImageService],
})
export class AppModule implements OnModuleInit {
  //okay el agu explica esto, el OnModuleInit es un hook que se ejecuta cuando el modulo se inicializa del todo.

  constructor(private dataSource: DataSource) {}
  //DataSource es la conexion a la DB, lo inyectamos para poder usarlo en el metodo de abajo.

  async onModuleInit() {
    await this.initializeCategories();
    await this.initializeWorks();
  }


  //Esto se podria borrar ya que fue para precargar una vez...

  private async initializeCategories() {
    // logica para precargar categorias

    const repo_categ = this.dataSource.getRepository(Category);
    //Me agarro el repo de Category desde la bd asi podemos hacerle cualquier cosa. En este caso es solo precargar datos.

    const count = await repo_categ.count();

    //Esto se ejecuta solo si la tabla esta vacia. Osea una vez en la vida.

    if (count === 0) {
      const categorias = [
        repo_categ.create({ name: 'Portones' }),
        repo_categ.create({ name: 'Rejas' }),
        repo_categ.create({ name: 'Puertas' }),
        repo_categ.create({ name: 'Otros' }),
      ];

      await repo_categ.save(categorias);
      console.log('✅ Datos iniciales de categorías cargados.');
    }
  }

  private async initializeWorks() {
    const repo_categ = this.dataSource.getRepository(Category);
    const repo_works = this.dataSource.getRepository(Work);

    //Me traigo las categorias que necesito para precargar los works.
    const portonesDeBase = await repo_categ.findOneBy({ name: 'Portones' });
    const rejasDeBase = await repo_categ.findOneBy({ name: 'Rejas' });
    const puertasDeBase = await repo_categ.findOneBy({ name: 'Puertas' });
    const otrosDeBase = await repo_categ.findOneBy({ name: 'Otros' });

    const count = await repo_works.count();
    if (count === 0) {
      const trabajos = [

        repo_works.create({
          title: 'Portón Corredizo Industrial',
          description:'Portón corredizo de 4m x 2.5m para entrada de galpón industrial. Incluye estructura de hierro galvanizado, ruedas industriales y sistema de traba. Acabado con pintura antióxido negro.',
          measures: '4.00m x 2.50m',
          //categoryId: portonesDeBase?.id,
          priority: Priority.HIGH,
          status: Status.PROGRESS,
          endDate: new Date('2025-08-25'),
          createAt: new Date('2025-08-3'),
          price: 85000.0,
          finalPrice: 80000.0,
        }),

        repo_works.create({
        title: 'Reja de Seguridad para Ventana',
        description: 'Reja decorativa con diseño de barrotes verticales y detalles ornamentales. Hierro forjado con tratamiento antióxido y pintura negra mate.',
        measures: '1.20m x 1.00m',
        //category: rejasDeBase,
        priority: Priority.MEDIUM,
        status: Status.PENDING,
        endDate: new Date('2025-08-20'),
        createAt: new Date('2025-08-05'),
        price: 25000.00,
        finalPrice: 0
        }),

        repo_works.create({
        title: 'Balcón con Barandas Decorativas',
        description: 'Balcón volado con estructura de hierro y barandas con diseño de hojas y flores. Base de chapa reforzada y acabado con pintura al horno color blanco.',
        measures: '2.00m x 0.80m',
        //category: otrosDeBase,
        priority: Priority.LOW,
        status: Status.CANCELED,
        endDate: new Date('2025-09-15'),
        createAt: new Date('2025-08-03'),
        price: 120000.00,
        finalPrice: 0
        }),

        repo_works.create({
          title: 'Puerta de Entrada Principal',
        description: 'Puerta de entrada de hierro macizo con vidrio templado superior. Incluye marco reforzado, cerradura multipunto y manijas de bronce. Diseño moderno minimalista.',
        measures: '0.90m x 2.10m',
        //category: puertasDeBase,
        priority: Priority.HIGH,
        status: Status.PRICE,
        endDate: new Date('2025-08-30'),
        createAt: new Date('2025-08-07'),
        price: 95000.00,
        finalPrice: 0

        })];

      await repo_works.save(trabajos);
      
    }
  }


}
