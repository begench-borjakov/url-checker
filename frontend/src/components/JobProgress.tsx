type JobProgressProps = {
  total: number
  processed: number
  successful: number
  failed: number
  cancelled: number
}

export function JobProgress({
  total,
  processed,
  successful,
  failed,
  cancelled,
}: JobProgressProps) {
  const progressPercent =
    total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0

  return (
    <div className="job-progress">
      <div className="job-progress__topline">
        <span>
          {processed} / {total} processed
        </span>
        <span>{progressPercent}%</span>
      </div>

      <div
        className="progress-bar"
        role="progressbar"
        aria-label="Job progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
      >
        <div className="progress-bar__value" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="job-progress__stats">
        <span>Success: {successful}</span>
        <span>Failed: {failed}</span>
        <span>Cancelled: {cancelled}</span>
      </div>
    </div>
  )
}
