import { useState, useEffect } from 'react'
import { getMyReturns, updateReturnStatus } from '../../services/api'

function MyReturns() {
  const [returns, setReturns] = useState([])
  const [userId] = useState(localStorage.getItem('userId') || '')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (userId) {
      fetchReturns()
    }
  }, [userId])

  async function fetchReturns() {
    try {
      const res = await getMyReturns(userId)
      setReturns(res.data)
    } catch (err) {
      setMsg('error:Failed to load returns')
    }
  }

  async function handleStatusChange(returnId, status) {
    try {
      await updateReturnStatus({ returnId, status })
      setMsg(`success:Status updated to ${status}!`)
      fetchReturns()
    } catch (err) {
      setMsg('error:Failed to update')
    }
  }

  return (
    <div>
      <nav>
        <h1>RegulareEdge</h1>
        <div>
          <a href="/co/create-return">Create Return</a>
          <a href="/co/my-returns">My Returns</a>
          <a href="/co/calendar">Calendar</a>
          <a href="/co/create-data-request">Request Data</a>        <a href="/notifications">🔔 Notifications</a>  {/* ADD THIS */}

          <a href="/co/view-data-requests">Data Status</a>
          <a href="/login">Logout</a>
        </div>
      </nav>

      <div className="page">
        <div className="card">
          <h2>My Returns</h2>
          <p style={{color:'#666',marginBottom:'16px'}}>Logged in as User ID: {userId}</p>

          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}

          <table>
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Obligation ID</th>
                <th>Period</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {returns.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign:'center',padding:'20px',color:'#888'}}>No returns found. Create a return first!</td></tr>
              ) : returns.map((ret) => (
                <tr key={ret.returnId}>
                  <td>{ret.returnId}</td>
                  <td>{ret.obligationId}</td>
                  <td>{ret.reportingPeriod}</td>
                  <td>{ret.submissionDeadline}</td>
                  <td>
                    <span className={`badge ${
                      ret.status === 'ACKNOWLEDGED' ? 'badge-green' :
                      ret.status === 'SUBMITTED' ? 'badge-blue' :
                      ret.status === 'PENDING_CCO_APPROVAL' ? 'badge-orange' : 'badge-red'
                    }`}>
                      {ret.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={ret.status}
                      onChange={(e) => handleStatusChange(ret.returnId, e.target.value)}
                      style={{padding:'5px',borderRadius:'4px',border:'1px solid #ddd',fontSize:'12px'}}
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                      <option value="PENDING_CCO_APPROVAL">PENDING_CCO_APPROVAL</option>
                      <option value="SUBMITTED">SUBMITTED</option>
                      <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                      <option value="LATE">LATE</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MyReturns