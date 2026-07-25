import type { JobStatus } from '../types/job'
import { useJobsStore } from '../store/jobsStore'
import { JobItemsTable } from './JobItemsTable'
import { JobProgress } from './JobProgress'

const ACTIVE_STATUSES: JobStatus[] = ['pending', 'in_progress']

export function JobDetails() {
  const activeJob = useJobsStore((state) => state.activeJob)
  const activeJobLoading = useJobsStore((state) => state.activeJobLoading)
  const cancelLoading = useJobsStore((state) => state.cancelLoading)
  const cancelActiveJob = useJobsStore((state) => state.cancelActiveJob)

  if (activeJobLoading && !activeJob) {
    return (
      <section className="card job-details">
        <p className="empty-state">Loading job details...</p>
      </section>
    )
  }

  if (!activeJob) {
    return (
      <section className="card job-details">
        <p className="empty-state">Select a job to see details.</p>
      </section>
    )
  }

  const canCancel = ACTIVE_STATUSES.includes(activeJob.status)

  return (
    <section className="card job-details">
      <div className="job-details__header">
        <div>
          <p className="eyebrow">Active job</p>
          <h2 title={activeJob.id}>{shortId(activeJob.id)}</h2>
        </div>

        {canCancel && (
          <button
            className="button button--danger"
            type="button"
            onClick={() => {
              void cancelActiveJob()
            }}
            disabled={cancelLoading}
          >
            {cancelLoading ? 'Cancelling...' : 'Cancel'}
          </button>
        )}
      </div>

      <dl className="details-grid">
        <DetailsItem label="Status" value={activeJob.status} />
        <DetailsItem label="Created" value={formatDate(activeJob.createdAt)} />
        <DetailsItem label="Started" value={formatNullableDate(activeJob.startedAt)} />
        <DetailsItem label="Finished" value={formatNullableDate(activeJob.finishedAt)} />
      </dl>

      <JobProgress
        total={activeJob.total}
        processed={activeJob.processed}
        successful={activeJob.successful}
        failed={activeJob.failed}
        cancelled={activeJob.cancelled}
      />

      <JobItemsTable items={activeJob.items} />
    </section>
  )
}

function DetailsItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function shortId(id: string): string {
  return id.slice(0, 8)
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(value))
}

function formatNullableDate(value: string | null): string {
  return value ? formatDate(value) : '—'
}
