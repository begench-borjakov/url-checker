import { JobItemStatus, JobStatus } from './job-status.enum';

export interface Job {
  readonly id: string;
  status: JobStatus;
  readonly createdAt: Date;
  startedAt: Date | null;
  finishedAt: Date | null;
  readonly items: JobItem[];
}

export interface JobItem {
  readonly id: string;
  readonly url: string;
  status: JobItemStatus;
  httpStatus: number | null;
  error: string | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  durationMs: number | null;
}
