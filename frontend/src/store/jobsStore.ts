import { create } from 'zustand'
import {
  cancelJob,
  createJob,
  getJobById,
  getJobs,
} from '../api/jobsApi'
import type { JobsStore } from './jobsStore.types'

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

      set({ jobs, jobsLoading: false })
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

      await get().fetchActiveJob()
      await get().fetchJobs()
    } catch (error) {
      set({ error: getErrorMessage(error), createLoading: false })
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

      set({ activeJob, activeJobLoading: false })
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
        set({ activeJob })
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
