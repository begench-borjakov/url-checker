import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useJobsStore } from '../store/jobsStore'

export function CreateJobForm() {
  const [inputValue, setInputValue] = useState('')
  const createJob = useJobsStore((state) => state.createJob)
  const createLoading = useJobsStore((state) => state.createLoading)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const urls = inputValue
      .split(/\r?\n/)
      .map((url) => url.trim())
      .filter(Boolean)

    if (urls.length === 0 || createLoading) {
      return
    }

    const created = await createJob(urls)

    if (created) {
      setInputValue('')
    }
  }

  return (
    <form className="card create-job-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <h2>Create job</h2>
        <p>Enter one URL per line.</p>
      </div>

      <label className="field">
        <span>URLs</span>
        <textarea
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={'https://example.com\nhttps://github.com'}
          rows={4}
          disabled={createLoading}
        />
      </label>

      <button
        className="button button--primary"
        type="submit"
        disabled={createLoading}
      >
        {createLoading ? 'Creating...' : 'Create job'}
      </button>
    </form>
  )
}
