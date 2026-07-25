import type { JobDetails, JobSummary } from '../types/job'

export type JobsState = {
  jobs: JobSummary[]
  activeJobId: string | null
  activeJob: JobDetails | null
  jobsLoading: boolean
  activeJobLoading: boolean
  createLoading: boolean
  cancelLoading: boolean
  error: string | null
}

export type JobsActions = {
  fetchJobs: () => Promise<void>
  createJob: (urls: string[]) => Promise<boolean>
  selectJob: (id: string) => void
  fetchActiveJob: (signal?: AbortSignal) => Promise<void>
  cancelActiveJob: () => Promise<void>
  clearError: () => void
}

export type JobsStore = JobsState & JobsActions
