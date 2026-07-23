import type { Job, JobItem } from '../entities/job.entity';
import { JobItemStatus } from '../entities/job-status.enum';
import { CreateJobRto } from '../rto/create-job.rto';
import { JobDetailsRto, JobItemRto } from '../rto/job-details.rto';
import { JobSummaryRto } from '../rto/job-summary.rto';

export function mapJobToCreateJobRto(job: Job): CreateJobRto {
  return new CreateJobRto(job.id);
}

export function mapJobToSummaryRto(job: Job): JobSummaryRto {
  const successful = job.items.filter(
    (item) => item.status === JobItemStatus.Success,
  ).length;
  const failed = job.items.filter(
    (item) => item.status === JobItemStatus.Error,
  ).length;
  const cancelled = job.items.filter(
    (item) => item.status === JobItemStatus.Cancelled,
  ).length;

  return new JobSummaryRto(
    job.id,
    job.createdAt.toISOString(),
    job.status,
    job.items.length,
    successful + failed + cancelled,
    successful,
    failed,
    cancelled,
  );
}

export function mapJobToDetailsRto(job: Job): JobDetailsRto {
  const summary = mapJobToSummaryRto(job);

  return new JobDetailsRto(
    summary.id,
    summary.createdAt,
    job.startedAt?.toISOString() ?? null,
    job.finishedAt?.toISOString() ?? null,
    summary.status,
    summary.total,
    summary.processed,
    summary.successful,
    summary.failed,
    summary.cancelled,
    job.items.map((item) => mapJobItemToRto(item)),
  );
}

function mapJobItemToRto(item: JobItem): JobItemRto {
  return new JobItemRto(
    item.id,
    item.url,
    item.status,
    item.httpStatus,
    item.error,
    item.startedAt?.toISOString() ?? null,
    item.finishedAt?.toISOString() ?? null,
    item.durationMs,
  );
}
