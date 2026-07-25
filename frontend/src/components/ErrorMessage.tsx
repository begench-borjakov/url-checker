import { useJobsStore } from '../store/jobsStore'

export function ErrorMessage() {
  const error = useJobsStore((state) => state.error)
  const clearError = useJobsStore((state) => state.clearError)

  if (!error) {
    return null
  }

  return (
    <div className="error-message" role="alert">
      <span>{error}</span>
      <button
        className="error-message__close"
        type="button"
        onClick={clearError}
        aria-label="Close error message"
      >
        ×
      </button>
    </div>
  )
}
