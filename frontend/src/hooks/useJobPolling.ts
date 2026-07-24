import { useEffect } from 'react'
import { useJobsStore } from '../store/jobsStore'
import type { JobStatus } from '../types/job'

const POLLING_DELAY_MS = 1000

const ACTIVE_STATUSES: JobStatus[] = ['pending', 'in_progress']

export function useJobPolling(): void {
  const activeJobId = useJobsStore((state) => state.activeJobId)
  const fetchActiveJob = useJobsStore((state) => state.fetchActiveJob)

  useEffect(() => {
    if (!activeJobId) {
      return
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let abortController: AbortController | null = null
    let isStopped = false

    async function poll(): Promise<void> {
      abortController = new AbortController()

      await fetchActiveJob(abortController.signal)

      abortController = null

      if (isStopped || !shouldContinuePolling()) {
        return
      }

      timeoutId = setTimeout(() => {
        void poll()
      }, POLLING_DELAY_MS)
    }

    function shouldContinuePolling(): boolean {
      const currentJob = useJobsStore.getState().activeJob

      if (!currentJob || currentJob.id !== activeJobId) {
        return true
      }

      return ACTIVE_STATUSES.includes(currentJob.status)
    }

    void poll()

    return () => {
      isStopped = true

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      abortController?.abort()
    }
  }, [activeJobId, fetchActiveJob])
}
