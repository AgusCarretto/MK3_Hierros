import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Work } from './Work.entity';

@Entity({name: 'work_images'})
export class WorkImage {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Work, work => work.images, { onDelete: 'CASCADE' })
  work: Work;

  @Column({ type: 'bytea' })
  imageData: Buffer;

  @Column({ length: 100 })
  imageName: string;

  @Column({ length: 50 })
  imageMimeType: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @CreateDateColumn()
  uploadedAt: Date;
}