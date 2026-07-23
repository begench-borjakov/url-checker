import { JobStatus } from '../entities/job-status.enum';

export class JobSummaryRto {
  constructor(
    readonly id: string,
    readonly createdAt: string,
    readonly status: JobStatus,
    readonly total: number,
    readonly processed: number,
    readonly successful: number,
    readonly failed: number,
    readonly cancelled: number,
  ) {}
}
