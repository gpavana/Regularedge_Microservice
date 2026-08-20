import { useState, useEffect } from 'react'
import { getAllReturnsAdmin } from '../../services/api'

function AllReturns() {
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchReturns()
  }, [])

  async function fetchReturns() {
    setLoading(true)
    try {
      const res = await getAllReturnsAdmin()
      setReturns(res.data)
    } catch (err) {
      console.error('Failed to load returns')
    } finally {
      setLoading(false)
    }
  }

  function getStatusBadge(status) {
    const colors = {
      'DRAFT': 'badge-gray',
      'PENDING_APPROVAL': 'badge-orange',
      'SUBMITTED': 'badge-green',
      'REJECTED': 'badge-red'
    }
    return <span className={`badge ${colors[status] || 'badge-gray'}`}>{status}</span>
  }

  return (
    <div>
      <nav>
        <h1>🛡️ RegulareEdge</h1>
        <div>
          <a href="/auditor/add-review">Add Review</a>
          <a href="/auditor/my-reviews">My Reviews</a>
          <a href="/auditor/all-returns">All Returns</a>
          <a href="/auditor/all-penalties">All Penalties</a>
          <a href="/auditor/all-data-requests">Data Requests</a>
          <a href="/auditor/all-obligations">All Obligations</a>
          <a href="/login">Logout</a>
        </div>
      </nav>

      <div className="page">
        <div className="card">
          <h2>All Regulatory Returns (Audit View)</h2>
          <p style={{color:'#666',fontSize:'14px',marginBottom:'20px'}}>
            View all returns for audit purposes (read-only access)
          </p>

          {loading ? (
            <p style={{textAlign:'center',padding:'20px'}}>Loading...</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Return ID</th>
                    <th>Obligation ID</th>
                    <th>Reporting Period</th>
                    <th>Prepared By</th>
                    <th>Schedules</th>
                    <th>Deadline</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.length === 0 ? (
                    <tr><td colSpan="7" style={{textAlign:'center',padding:'20px',color:'#888'}}>No returns found</td></tr>
                  ) : returns.map(ret => (
                    <tr key={ret.returnId}>
                      <td>{ret.returnId}</td>
                      <td>{ret.obligationId}</td>
                      <td>{ret.reportingPeriod}</td>
                      <td>{ret.preparedById}</td>
                      <td>{ret.totalSchedules}</td>
                      <td>{ret.submissionDeadline}</td>
                      <td>{getStatusBadge(ret.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllReturns