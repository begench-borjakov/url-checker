import { useJobsStore } from '../store/jobsStore'
import type { JobSummary } from '../types/job'

export function JobsList() {
  const jobs = useJobsStore((state) => state.jobs)
  const activeJobId = useJobsStore((state) => state.activeJobId)
  const jobsLoading = useJobsStore((state) => state.jobsLoading)
  const selectJob = useJobsStore((state) => state.selectJob)

  return (
    <section className="card jobs-list">
      <div className="section-heading">
        <h2>Jobs</h2>
        <p>Recent jobs are shown first.</p>
      </div>

      {jobsLoading && jobs.length === 0 && <p className="empty-state">Loading jobs...</p>}

      {!jobsLoading && jobs.length === 0 && (
        <p className="empty-state">No jobs yet. Create the first one.</p>
      )}

      {jobs.length > 0 && (
        <div className="jobs-list__items">
          {jobs.map((job) => (
            <button
              className={[
                'jobs-list__item',
                job.id === activeJobId ? 'jobs-list__item--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              type="button"
              key={job.id}
              onClick={() => {
                if (job.id !== activeJobId) {
                  selectJob(job.id)
                }
              }}
              aria-pressed={job.id === activeJobId}
            >
              <JobListItem job={job} />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function JobListItem({ job }: { job: JobSummary }) {
  return (
    <>
      <div className="jobs-list__item-header">
        <span title={job.id}>{job.id.slice(0, 8)}</span>
        <span className="status-pill">{job.status}</span>
      </div>
      <div className="jobs-list__meta">
        <span>{formatDate(job.createdAt)}</span>
        <span>
          {job.processed} / {job.total}
        </span>
      </div>
      <div className="jobs-list__counts">
        <span>Success: {job.successful}</span>
        <span>Failed: {job.failed}</span>
        <span>Cancelled: {job.cancelled}</span>
      </div>
    </>
  )
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}
