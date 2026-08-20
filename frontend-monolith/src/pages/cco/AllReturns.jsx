import { useState, useEffect } from 'react'
import { getAllUsers, getAllReturnsAdmin, downloadReturnDocument } from '../../services/api'

function AllReturns() {
  const [returns, setReturns] = useState([])
  const [msg, setMsg] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchReturns()
  }, [])

  async function fetchReturns() {
    try {
      const res = await getAllReturnsAdmin()
      setReturns(res.data)
    } catch (err) {
      setMsg('error:Failed to load returns')
    }
  }

  async function handleViewData(returnId) {
    try {
      const res = await downloadReturnDocument(returnId)
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', res.fileName || `return_${returnId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      setMsg('success:Opened the return document.')
    } catch (err) {
      setMsg('error:No document attached to this return.')
    }
  }

  const filteredReturns = filter === 'all'
    ? returns
    : returns.filter(r => r.status === filter)

  return (
    <div>
      <nav style={{background:'linear-gradient(135deg, #1a237e, #283593)'}}>
        <h1>🛡️ RegulareEdge</h1>
        <div>
          <a href="/cco/dashboard">Dashboard</a>
          <a href="/cco/all-returns">All Returns</a>
          <a href="/cco/all-obligations">All Obligations</a>
          <a href="/cco/calendar">Calendar</a>
          <a href="/cco/all-penalties">All Penalties</a>
          <a href="/cco/all-audits">Audit Reviews</a>
          <a href="/login">Logout</a>
        </div>
      </nav>

      <div className="page">
        <div className="card">
          <h2>All Regulatory Returns</h2>
          <p style={{color:'#666',marginBottom:'16px'}}>Complete overview of all returns across all COs</p>

          <div className="filters">
            <button className={`btn ${filter === 'all' ? 'btn-primary' : ''}`} onClick={() => setFilter('all')}>All ({returns.length})</button>
            <button className={`btn ${filter === 'DRAFT' ? 'btn-primary' : ''}`} onClick={() => setFilter('DRAFT')}>Draft</button>
            <button className={`btn ${filter === 'PENDING_CCO_APPROVAL' ? 'btn-primary' : ''}`} onClick={() => setFilter('PENDING_CCO_APPROVAL')}>Pending</button>
            <button className={`btn ${filter === 'SUBMITTED' ? 'btn-primary' : ''}`} onClick={() => setFilter('SUBMITTED')}>Submitted</button>
            <button className={`btn ${filter === 'ACKNOWLEDGED' ? 'btn-primary' : ''}`} onClick={() => setFilter('ACKNOWLEDGED')}>Acknowledged</button>
          </div>

          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Obligation ID</th>
                <th>Period</th>
                <th>Prepared By</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign:'center',padding:'30px',color:'#888'}}>No returns found</td></tr>
              ) : filteredReturns.map(ret => (
                <tr key={ret.returnId}>
                  <td><strong>{ret.returnId}</strong></td>
                  <td>{ret.obligationId}</td>
                  <td><strong>{ret.reportingPeriod}</strong></td>
                  <td>User #{ret.preparedById}</td>
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
                    <button className="btn btn-primary btn-sm" onClick={() => handleViewData(ret.calendarId)}>
                      📄 View Data PDF
                    </button>
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

export default AllReturns