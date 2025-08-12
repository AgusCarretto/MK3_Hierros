import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name:'categories'})//Aca va el nombre de la tabla en la DB
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

}
