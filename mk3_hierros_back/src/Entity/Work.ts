import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  dateStart: Date;


}
