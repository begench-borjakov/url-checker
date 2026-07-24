import { Injectable } from '@nestjs/common';
import { JobItemStatus, JobStatus } from './entities/job-status.enum';
import type { Job, JobItem } from './entities/job.entity';
import { JobsRepository } from './jobs.repository';

const MAX_CONCURRENT_ITEMS_PER_JOB = 5;
const HEAD_REQUEST_TIMEOUT_MS = 10_000;
const MAX_ARTIFICIAL_DELAY_MS = 10_000;

@Injectable()
export class JobsProcessor {
  constructor(private readonly jobsRepository: JobsRepository) {}

  async process(jobId: string): Promise<void> {
    const job = this.jobsRepository.findById(jobId);

    if (!job) {
      return;
    }

    try {
      this.startJob(job);
      await this.runWorkers(job);
      this.finishJob(job);
    } catch {
      this.failJob(job);
    }
  }

  private startJob(job: Job): void {
    if (job.status !== JobStatus.Pending) {
      return;
    }

    job.status = JobStatus.InProgress;
    job.startedAt ??= new Date();

    this.jobsRepository.save(job);
  }

  private async runWorkers(job: Job): Promise<void> {
    const workerCount = Math.min(
      MAX_CONCURRENT_ITEMS_PER_JOB,
      job.items.length,
    );
    const workers = Array.from({ length: workerCount }, () =>
      this.runWorker(job),
    );

    await Promise.all(workers);
  }

  private async runWorker(job: Job): Promise<void> {
    while (job.status === JobStatus.InProgress) {
      const item = this.getNextPendingItem(job);

      if (!item) {
        return;
      }

      await this.processItem(job, item);
    }
  }

  private getNextPendingItem(job: Job): JobItem | null {
    return (
      job.items.find((item) => item.status === JobItemStatus.Pending) ?? null
    );
  }

  private async processItem(job: Job, item: JobItem): Promise<void> {
    item.status = JobItemStatus.InProgress;
    item.startedAt = new Date();
    this.jobsRepository.save(job);

    try {
      const httpStatus = await this.checkUrl(item.url);
      await this.delayRandomly();

      item.status = JobItemStatus.Success;
      item.httpStatus = httpStatus;
      item.error = null;
    } catch (error) {
      await this.delayRandomly();

      item.status = JobItemStatus.Error;
      item.httpStatus = null;
      item.error = this.getSafeErrorMessage(error);
    } finally {
      item.finishedAt = new Date();
      item.durationMs = this.calculateDurationMs(item);
      this.jobsRepository.save(job);
    }
  }

  private async checkUrl(url: string): Promise<number> {
    const abortController = new AbortController();
    const timeoutId = setTimeout(
      () => abortController.abort(),
      HEAD_REQUEST_TIMEOUT_MS,
    );

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: abortController.signal,
      });

      return response.status;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private delayRandomly(): Promise<void> {
    const delayMs = Math.floor(Math.random() * (MAX_ARTIFICIAL_DELAY_MS + 1));

    return new Promise((resolve) => {
      setTimeout(resolve, delayMs);
    });
  }

  private calculateDurationMs(item: JobItem): number | null {
    if (!item.startedAt || !item.finishedAt) {
      return null;
    }

    return item.finishedAt.getTime() - item.startedAt.getTime();
  }

  private finishJob(job: Job): void {
    if (job.status === JobStatus.Cancelled) {
      job.finishedAt ??= new Date();
      this.jobsRepository.save(job);

      return;
    }

    if (this.areAllItemsFinal(job)) {
      job.status = JobStatus.Completed;
      job.finishedAt = new Date();
      this.jobsRepository.save(job);
    }
  }

  private failJob(job: Job): void {
    if (job.status === JobStatus.Cancelled) {
      job.finishedAt ??= new Date();
      this.jobsRepository.save(job);

      return;
    }

    job.status = JobStatus.Failed;
    job.finishedAt = new Date();
    this.jobsRepository.save(job);
  }

  private areAllItemsFinal(job: Job): boolean {
    return job.items.every((item) =>
      [
        JobItemStatus.Success,
        JobItemStatus.Error,
        JobItemStatus.Cancelled,
      ].includes(item.status),
    );
  }

  private getSafeErrorMessage(error: unknown): string {
    if (error instanceof Error && error.name === 'AbortError') {
      return 'Request timed out';
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Request failed';
  }
}
