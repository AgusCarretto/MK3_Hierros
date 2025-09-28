import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name:'categories'})//Aca va el nombre de la tabla en la DB
export class Category {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({unique: true})
  name: string;

}
