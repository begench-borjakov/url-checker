import type {
  CreateJobRequest,
  CreateJobResponse,
  JobDetails,
  JobSummary,
} from '../types/job'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export async function createJob(urls: string[]): Promise<CreateJobResponse> {
  return request<CreateJobResponse>('/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ urls } satisfies CreateJobRequest),
  })
}

export async function getJobs(): Promise<JobSummary[]> {
  return request<JobSummary[]>('/jobs')
}

export async function getJobById(
  id: string,
  signal?: AbortSignal,
): Promise<JobDetails> {
  return request<JobDetails>(`/jobs/${id}`, { signal })
}

export async function cancelJob(id: string): Promise<JobDetails> {
  return request<JobDetails>(`/jobs/${id}`, {
    method: 'DELETE',
  })
}

async function request<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, init)

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return response.json() as Promise<TResponse>
}

async function getErrorMessage(response: Response): Promise<string> {
  const fallbackMessage = `Request failed with status ${response.status}`

  try {
    const body: unknown = await response.json()

    if (
      isRecord(body) &&
      typeof body.message === 'string' &&
      body.message.trim()
    ) {
      return body.message
    }

    if (isRecord(body) && Array.isArray(body.message)) {
      const messages = body.message.filter(
        (message): message is string => typeof message === 'string',
      )

      if (messages.length > 0) {
        return messages.join(', ')
      }
    }
  } catch {
    return fallbackMessage
  }

  return fallbackMessage
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
