import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
 app.enableCors({ //Esto habilita el accesso desde el frontend 
    origin: 'http://localhost:3001', // La URL del frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
