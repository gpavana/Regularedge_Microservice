import { useState } from 'react'
import { getReturnsByStatus } from '../../services/api.js'

function ReturnsByStatus() {
  const [status, setStatus]   = useState('DRAFT')
  const [returns, setReturns] = useState([])
  const [msg, setMsg]         = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    setLoading(true)
    setMsg('')
    try {
      const res = await getReturnsByStatus(status)
      setReturns(res.data)
      if (res.data.length === 0) setMsg('error:No returns found for this status.')
    } catch (err) {
      setMsg('error:Failed to load returns.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
<nav>
  <h1>RegulareEdge</h1>
  <div>
    <a href="/co/create-return">Create Return</a>
    <a href="/co/my-returns">My Returns</a>
    <a href="/co/returns-by-status">Filter Returns</a>
    <a href="/co/calendar">Calendar</a>
    <a href="/co/create-data-request">Request Data</a>        <a href="/notifications">🔔 Notifications</a>  {/* ADD THIS */}

    <a href="/co/view-data-requests">Data Status</a>
    <a href="/login">Logout</a> 
  </div>
</nav>

      <div className="page">
        <div className="card">
          <h2>Filter Returns by Status</h2>

          <div className="filter-row">
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="DRAFT">DRAFT</option>
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
              <option value="PENDING_CCO_APPROVAL">PENDING CCO APPROVAL</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
              <option value="LATE">LATE</option>
            </select>
            <button className="btn btn-primary" onClick={handleSearch}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'} style={{ marginBottom: '14px' }}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Return ID</th><th>Reporting Period</th><th>Deadline</th><th>Status</th></tr>
              </thead>
              <tbody>
                {returns.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Select status and click Search</td></tr>
                ) : returns.map((r) => (
                  <tr key={r.returnId}>
                    <td>{r.returnId}</td>
                    <td>{r.reportingPeriod}</td>
                    <td>{r.submissionDeadline}</td>
                    <td><span className="badge badge-blue">{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReturnsByStatus
