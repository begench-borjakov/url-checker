import type { JobItem } from '../types/job'

type JobItemsTableProps = {
  items: JobItem[]
}

export function JobItemsTable({ items }: JobItemsTableProps) {
  if (items.length === 0) {
    return <p className="empty-state">No URLs in this job.</p>
  }

  return (
    <div className="items-table-wrapper">
      <table className="items-table">
        <thead>
          <tr>
            <th>URL</th>
            <th>Status</th>
            <th>HTTP</th>
            <th>Error</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="items-table__url" title={item.url}>
                {item.url}
              </td>
              <td>{item.status}</td>
              <td>{formatNullableNumber(item.httpStatus)}</td>
              <td>{item.error ?? '—'}</td>
              <td>{formatDuration(item.durationMs)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatNullableNumber(value: number | null): string {
  return value === null ? '—' : String(value)
}

function formatDuration(value: number | null): string {
  return value === null ? '—' : `${value} ms`
}
