import { Injectable } from '@nestjs/common';
import { Priority, Status, Work } from '../Entity/Work';
@Injectable()
export class TrabajoService {
 
  getAll(): Work[] {
    return [
      {
        id: 1,
        title: 'Portón Corredizo Industrial',
        description: 'Portón corredizo de 4m x 2.5m para entrada de galpón industrial. Incluye estructura de hierro galvanizado, ruedas industriales y sistema de traba. Acabado con pintura antióxido negro.',
        image: 'porton_industrial_001.jpg',
        measures: '4.00m x 2.50m',
        category: 'Portones',
        priority: Priority.HIGH,
        status: Status.PROGRESS,
        endDate: new Date('2025-08-25'),
        createAt: new Date('2025-08-01'),
        price: 85000.00,
        finalPrice: 80000.00
      },
      {
        id: 2,
        title: 'Reja de Seguridad para Ventana',
        description: 'Reja decorativa con diseño de barrotes verticales y detalles ornamentales. Hierro forjado con tratamiento antióxido y pintura negra mate.',
        image: 'reja_ventana_002.jpg',
        measures: '1.20m x 1.00m',
        category: 'Rejas',
        priority: Priority.MEDIUM,
        status: Status.PENDING,
        endDate: new Date('2025-08-20'),
        createAt: new Date('2025-08-05'),
        price: 25000.00,
        finalPrice: 0
      },
      {
        id: 3,
        title: 'Escalera Caracol Exterior',
        description: 'Escalera caracol de hierro para acceso a planta alta. Estructura de caño de 2" con peldaños antideslizantes y barandas de seguridad. Incluye descanso superior.',
        image: 'escalera_caracol_003.jpg',
        measures: 'H: 3.20m - Ø: 1.50m',
        category: 'Escaleras',
        priority: Priority.CRITIC,
        status: Status.FINISH,
        endDate: new Date('2025-08-10'),
        createAt: new Date('2025-07-20'),
        price: 150000.00,
        finalPrice: 145000.00
      },
      {
        id: 4,
        title: 'Balcón con Barandas Decorativas',
        description: 'Balcón volado con estructura de hierro y barandas con diseño de hojas y flores. Base de chapa reforzada y acabado con pintura al horno color blanco.',
        image: 'balcon_decorativo_004.jpg',
        measures: '2.00m x 0.80m',
        category: 'Balcones',
        priority: Priority.LOW,
        status: Status.CANCELED,
        endDate: new Date('2025-09-15'),
        createAt: new Date('2025-08-03'),
        price: 120000.00,
        finalPrice: 0
      },
      {
        id: 5,
        title: 'Puerta de Entrada Principal',
        description: 'Puerta de entrada de hierro macizo con vidrio templado superior. Incluye marco reforzado, cerradura multipunto y manijas de bronce. Diseño moderno minimalista.',
        image: 'puerta_entrada_005.jpg',
        measures: '0.90m x 2.10m',
        category: 'Puertas',
        priority: Priority.HIGH,
        status: Status.PRICE,
        endDate: new Date('2025-08-30'),
        createAt: new Date('2025-08-07'),
        price: 95000.00,
        finalPrice: 0
      }
    ];
  }

  createWork(work: Work): Work {
    const newWork = new Work();
    // newWork.name = work.name;
    // newWork.description = work.description;
    // newWork.dateStart = work.dateStart;

   //Guardar newWork en la base de datos

    return newWork; 
  }

  deleteWork(id: number): void {
   
    //logica para encontrar el trabajo por id y eliminarlo

  }

  updateWork(work: Work): Work {
    
    //logica para encontrar el trabajo por id y actualizarlo

    return work;
  }
  
 
}
