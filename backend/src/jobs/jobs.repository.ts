import { Injectable } from '@nestjs/common';
import { JobStatus } from './entities/job-status.enum';
import type { Job } from './entities/job.entity';
import type { CreateJobParams, SaveJobParams } from './entities/job.types';

@Injectable()
export class JobsRepository {
  private readonly jobs = new Map<string, Job>();

  create(params: CreateJobParams): Job {
    const job: Job = {
      id: params.id,
      status: params.status ?? JobStatus.Pending,
      createdAt: params.createdAt ?? new Date(),
      startedAt: params.startedAt ?? null,
      finishedAt: params.finishedAt ?? null,
      items: params.items,
    };

    this.jobs.set(job.id, job);

    return job;
  }

  findAll(): Job[] {
    return Array.from(this.jobs.values()).sort(
      (firstJob, secondJob) =>
        secondJob.createdAt.getTime() - firstJob.createdAt.getTime(),
    );
  }

  findById(id: string): Job | null {
    return this.jobs.get(id) ?? null;
  }

  save(job: SaveJobParams): Job {
    this.jobs.set(job.id, job);

    return job;
  }
}
