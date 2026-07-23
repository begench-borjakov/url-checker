import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { JobItemStatus, JobStatus } from './entities/job-status.enum';
import type { JobItem } from './entities/job.entity';
import {
  mapJobToCreateJobRto,
  mapJobToDetailsRto,
  mapJobToSummaryRto,
} from './mappers/job.mapper';
import { JobsRepository } from './jobs.repository';
import { CreateJobRto } from './rto/create-job.rto';
import { JobDetailsRto } from './rto/job-details.rto';
import { JobSummaryRto } from './rto/job-summary.rto';
import type { CreateJobData } from './entities/job.types';

@Injectable()
export class JobsService {
  constructor(private readonly jobsRepository: JobsRepository) {}

  create(data: CreateJobData): CreateJobRto {
    const job = this.jobsRepository.create({
      id: randomUUID(),
      items: data.urls.map((url) => this.createPendingItem(url)),
    });

    return mapJobToCreateJobRto(job);
  }

  findAll(): JobSummaryRto[] {
    return this.jobsRepository.findAll().map((job) => mapJobToSummaryRto(job));
  }

  findById(id: string): JobDetailsRto {
    const job = this.jobsRepository.findById(id);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return mapJobToDetailsRto(job);
  }

  cancel(id: string): JobDetailsRto {
    const job = this.jobsRepository.findById(id);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (
      job.status !== JobStatus.Pending &&
      job.status !== JobStatus.InProgress
    ) {
      return mapJobToDetailsRto(job);
    }

    const cancelledAt = new Date();

    job.status = JobStatus.Cancelled;

    for (const item of job.items) {
      if (item.status === JobItemStatus.Pending) {
        item.status = JobItemStatus.Cancelled;
        item.finishedAt = cancelledAt;
      }
    }

    const hasRunningItems = job.items.some(
      (item) => item.status === JobItemStatus.InProgress,
    );

    if (!hasRunningItems) {
      job.finishedAt = cancelledAt;
    }

    this.jobsRepository.save(job);

    return mapJobToDetailsRto(job);
  }

  private createPendingItem(url: string): JobItem {
    return {
      id: randomUUID(),
      url,
      status: JobItemStatus.Pending,
      httpStatus: null,
      error: null,
      startedAt: null,
      finishedAt: null,
      durationMs: null,
    };
  }
}
