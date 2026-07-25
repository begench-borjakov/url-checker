import { create } from 'zustand'
import {
  cancelJob,
  createJob,
  getJobById,
  getJobs,
} from '../api/jobsApi'
import type { JobDetails, JobStatus, JobSummary } from '../types/job'
import type { JobsStore } from './jobsStore.types'

const TERMINAL_STATUSES: JobStatus[] = ['completed', 'cancelled', 'failed']

export const useJobsStore = create<JobsStore>((set, get) => ({
  jobs: [],
  activeJobId: null,
  activeJob: null,
  jobsLoading: false,
  activeJobLoading: false,
  createLoading: false,
  cancelLoading: false,
  error: null,

  async fetchJobs() {
    set({ jobsLoading: true, error: null })

    try {
      const jobs = await getJobs()
      const activeJobId = get().activeJobId ?? jobs[0]?.id ?? null

      set({ jobs, activeJobId, jobsLoading: false })
    } catch (error) {
      set({ error: getErrorMessage(error), jobsLoading: false })
    }
  },

  async createJob(urls) {
    set({ createLoading: true, error: null })

    try {
      const response = await createJob(urls)

      set({
        activeJobId: response.jobId,
        activeJob: null,
        createLoading: false,
      })

      await get().fetchJobs()

      return true
    } catch (error) {
      set({ error: getErrorMessage(error), createLoading: false })

      return false
    }
  },

  selectJob(id) {
    set({
      activeJobId: id,
      activeJob: null,
      activeJobLoading: false,
      error: null,
    })
  },

  async fetchActiveJob(signal) {
    const requestedJobId = get().activeJobId

    if (!requestedJobId) {
      return
    }

    set({ activeJobLoading: true, error: null })

    try {
      const activeJob = await getJobById(requestedJobId, signal)

      if (get().activeJobId !== requestedJobId) {
        return
      }

      const currentJob = get().activeJob

      if (
        currentJob?.id === requestedJobId &&
        TERMINAL_STATUSES.includes(currentJob.status) &&
        !TERMINAL_STATUSES.includes(activeJob.status)
      ) {
        set({ activeJobLoading: false })
        return
      }

      set({
        activeJob,
        activeJobLoading: false,
        jobs: syncJobSummary(get().jobs, activeJob),
      })
    } catch (error) {
      if (get().activeJobId !== requestedJobId) {
        return
      }

      if (isAbortError(error)) {
        set({ activeJobLoading: false })
        return
      }

      set({ error: getErrorMessage(error), activeJobLoading: false })
    }
  },

  async cancelActiveJob() {
    const activeJobId = get().activeJobId

    if (!activeJobId) {
      return
    }

    set({ cancelLoading: true, error: null })

    try {
      const activeJob = await cancelJob(activeJobId)

      if (get().activeJobId === activeJob.id) {
        set({
          activeJob,
          jobs: syncJobSummary(get().jobs, activeJob),
        })
      }

      await get().fetchJobs()
      set({ cancelLoading: false })
    } catch (error) {
      set({ error: getErrorMessage(error), cancelLoading: false })
    }
  },

  clearError() {
    set({ error: null })
  },
}))

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Something went wrong'
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

function syncJobSummary(jobs: JobSummary[], jobDetails: JobDetails): JobSummary[] {
  const jobSummary = mapJobDetailsToSummary(jobDetails)
  const hasJob = jobs.some((job) => job.id === jobSummary.id)

  if (!hasJob) {
    return [jobSummary, ...jobs]
  }

  return jobs.map((job) => (job.id === jobSummary.id ? jobSummary : job))
}

function mapJobDetailsToSummary(jobDetails: JobDetails): JobSummary {
  return {
    id: jobDetails.id,
    createdAt: jobDetails.createdAt,
    status: jobDetails.status,
    total: jobDetails.total,
    processed: jobDetails.processed,
    successful: jobDetails.successful,
    failed: jobDetails.failed,
    cancelled: jobDetails.cancelled,
  }
}
