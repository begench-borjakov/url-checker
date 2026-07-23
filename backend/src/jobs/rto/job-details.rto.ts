import { JobItemStatus, JobStatus } from '../entities/job-status.enum';

export class JobItemRto {
  constructor(
    readonly id: string,
    readonly url: string,
    readonly status: JobItemStatus,
    readonly httpStatus: number | null,
    readonly error: string | null,
    readonly startedAt: string | null,
    readonly finishedAt: string | null,
    readonly durationMs: number | null,
  ) {}
}

export class JobDetailsRto {
  constructor(
    readonly id: string,
    readonly createdAt: string,
    readonly startedAt: string | null,
    readonly finishedAt: string | null,
    readonly status: JobStatus,
    readonly total: number,
    readonly processed: number,
    readonly successful: number,
    readonly failed: number,
    readonly cancelled: number,
    readonly items: JobItemRto[],
  ) {}
}
