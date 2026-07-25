import { useEffect } from 'react'
import './App.css'
import { CreateJobForm } from './components/CreateJobForm'
import { ErrorMessage } from './components/ErrorMessage'
import { JobDetails } from './components/JobDetails'
import { JobsList } from './components/JobsList'
import { useJobPolling } from './hooks/useJobPolling'
import { useJobsStore } from './store/jobsStore'

function App() {
  const fetchJobs = useJobsStore((state) => state.fetchJobs)

  useJobPolling()

  useEffect(() => {
    void fetchJobs()
  }, [fetchJobs])

  return (
    <main className="app">
      <div className="app__content">
        <header className="app__header">
          <h1>URL Checker</h1>
          <p>Create URL checking jobs, track progress, and cancel active work.</p>
        </header>

        <ErrorMessage />

        <CreateJobForm />

        <div className="app__layout">
          <JobsList />
          <JobDetails />
        </div>
      </div>
    </main>
  )
}

export default App
