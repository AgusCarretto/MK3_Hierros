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

  async getByCategoryFinished(categoryId: string): Promise<any[]> {
    const works = await this.repoWork.find({
      where: {
        status: Status.FINISH,
        category: { id: categoryId },
      },
    });
    return this.enrichWithPreviewImageId(works);
  }


  async getByPriority(priority: Priority): Promise<Work[]> {
    return await this.repoWork.find({ where: { priority } });
  }

  async getByStatus(status: Status): Promise<any[]> {
    const works = await this.repoWork.find({ where: { status } });
    return this.enrichWithPreviewImageId(works);
  }

  private async enrichWithPreviewImageId(works: Work[]): Promise<any[]> {
    if (works.length === 0) return works;
    const ids = works.map((w) => w.id);
    const previews: { workId: string; id: string }[] =
      await this.repoWork.manager.query(
        `SELECT DISTINCT ON ("workId") id, "workId"
         FROM work_images
         WHERE "workId" = ANY($1)
         ORDER BY "workId", "order" ASC`,
        [ids],
      );
    const previewMap: Record<string, string> = {};
    for (const row of previews) {
      previewMap[row.workId] = row.id;
    }
    return works.map((w) => ({ ...w, previewImageId: previewMap[w.id] ?? null }));
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
