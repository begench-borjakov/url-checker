import type { Job, JobItem } from './job.entity';
import type { JobStatus } from './job-status.enum';

export type CreateJobParams = {
  id: string;
  items: JobItem[];
  status?: JobStatus;
  createdAt?: Date;
  startedAt?: Date | null;
  finishedAt?: Date | null;
};

export type SaveJobParams = Job;
