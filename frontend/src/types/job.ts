export type JobStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'failed'

export type JobItemStatus =
  | 'pending'
  | 'in_progress'
  | 'success'
  | 'error'
  | 'cancelled'

export type CreateJobRequest = {
  urls: string[]
}

export type CreateJobResponse = {
  jobId: string
}

export type JobSummary = {
  id: string
  createdAt: string
  status: JobStatus
  total: number
  processed: number
  successful: number
  failed: number
  cancelled: number
}

export type JobItem = {
  id: string
  url: string
  status: JobItemStatus
  httpStatus: number | null
  error: string | null
  startedAt: string | null
  finishedAt: string | null
  durationMs: number | null
}

export type JobDetails = {
  id: string
  status: JobStatus
  createdAt: string
  startedAt: string | null
  finishedAt: string | null
  total: number
  processed: number
  successful: number
  failed: number
  cancelled: number
  items: JobItem[]
}
