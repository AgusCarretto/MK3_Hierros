import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
export enum Priority{
    LOW = 'Baja',
    MEDIUM = 'Media',
    HIGH = 'Alta',
    CRITIC = 'Crítica'
    }

export enum Status{
    PROGRESS = 'En curso',
    CANCELED = 'Cancelado',
    PRICE = 'Cotización',
    PENDING = 'Pendiente Aprobación',
    FINISH = 'Finalizado',
    BUYING = 'Compra Materiales',
    }
@Entity('works')
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ length: 100 })
  measures: string;

  @Column({ length: 100 })
  category: string;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.MEDIUM
  })
  priority: Priority;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING
  })
  status: Status;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @CreateDateColumn()
  createAt: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  finalPrice: number;
}