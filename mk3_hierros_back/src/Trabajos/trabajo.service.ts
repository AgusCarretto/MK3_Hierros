import { Injectable } from '@nestjs/common';
import { Priority, Status, Work } from '../Entity/Work.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrabajoService {
  constructor(
    @InjectRepository(Work)
    private readonly repo_work: Repository<Work>,
  ) {}

  async getAll(): Promise<Work[]> {
    return await this.repo_work.find();
  }

  async getById(id: number): Promise<Work> {
    const work = await this.repo_work.findOneBy({ id });
    if (work !== null) {
      return work;
    } else {
      throw new Error(`El trabajo con id:${id} no se encuentra.`);
    }
  }

  async getByCategory(categoryId: number): Promise<Work[]> {
    return await this.repo_work.find({
      where: { category: { id: categoryId } },
    });
  }

  async getByPriority(priority: Priority): Promise<Work[]> {
    return await this.repo_work.find({ where: { priority } });
  }

  async getByStatus(status: Status): Promise<Work[]> {
    return await this.repo_work.find({ where: { status } });
  }

  async createWork(work: Work): Promise<Work> {
    const newWork = this.repo_work.create(work);
    this.repo_work.save(newWork);
    return newWork;
  }

  async deleteWork(id: number): Promise<void> {
    const work = await this.repo_work.findOne({ where: { id: id } });
    if (work) {
      await this.repo_work.remove(work);
    }
  }

  async updateWork(work: Work): Promise<Work> {
    await this.repo_work.save(work);
    return work;
  }
}
