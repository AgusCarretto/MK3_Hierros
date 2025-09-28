import { Injectable } from '@nestjs/common';
import { Priority, Status, Work } from '../Entity/Work.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateWorkDto } from './dto/updateWork.dto';

@Injectable()
export class TrabajoService {
  constructor(
    @InjectRepository(Work)
    private readonly repoWork: Repository<Work>,
  ) {}

  async getAll(): Promise<Work[]> {
    return await this.repoWork.find({
      order: { priority: 'DESC' },
      relations: ['images'],
    });
  }

  async getById(id: string): Promise<Work> {
    const work = await this.repoWork.findOne({
      where: { id },
      relations: ['images'],
    });
    if (work !== null) {
      return work;
    } else {
      throw new Error(`El trabajo con id:${id} no se encuentra.`);
    }
  }

  async getByCategory(categoryId: string): Promise<Work[]> {
    return await this.repoWork.find({
      where: { category: { id: categoryId } },
    });
  }

  async getByPriority(priority: Priority): Promise<Work[]> {
    return await this.repoWork.find({ where: { priority } });
  }

  async getByStatus(status: Status): Promise<Work[]> {
    return await this.repoWork.find({ where: { status } });
  }

  async createWork(work: Work): Promise<Work> {
    const newWork = this.repoWork.create(work);
    this.repoWork.save(newWork);
    return newWork;
  }

  async deleteWork(id: string): Promise<void> {
    const work = await this.repoWork.findOne({ where: { id } });
    if (work) {
      await this.repoWork.remove(work);
    }
  }

  async updateWork(id: string, work: UpdateWorkDto): Promise<Work> {
    const existingWork = await this.repoWork.findOneBy({ id });
    if (!existingWork)
      throw new Error(`El trabajo con id:${id} no se encuentra.`);
    Object.assign(existingWork, work);
    return await this.repoWork.save(existingWork);
  }
}
