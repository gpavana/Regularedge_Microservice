import { useState, useEffect } from 'react'
import { getCCODashboard, updateReturnStatus, getAllPenalties, getPendingReturns, downloadReturnDocument } from '../../services/api'

function CCODashboard() {
  const [dashboard, setDashboard] = useState({
    pendingApprovals: 0,
    openPenalties: 0,
    totalPenaltyAmount: 0
  })
  const [pendingReturns, setPendingReturns] = useState([])
  const [penalties, setPenalties] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetchDashboard()
    fetchPenalties()
    fetchPendingReturns()
  }, [])

  async function fetchDashboard() {
    try {
      const res = await getCCODashboard()
      setDashboard(res.data)
    } catch (err) {
      console.error('Failed to load dashboard')
    }
  }

  async function fetchPenalties() {
    try {
      const res = await getAllPenalties()
      const openPenalties = res.data.filter(p => p.status === 'OPEN')
      setPenalties(openPenalties)
    } catch (err) {
      console.error('Failed to load penalties')
    }
  }

  async function fetchPendingReturns() {
    try {
      const res = await getPendingReturns()
      setPendingReturns(res.data)
    } catch (err) {
      console.error('Failed to load pending returns')
    }
  }

  async function handleApprove(returnId) {
    if (!window.confirm('Approve this return for submission to regulator?')) return

    try {
      await updateReturnStatus({ returnId, status: 'SUBMITTED' })
      setMsg('success:✅ Return approved and submitted to regulator!')
      fetchDashboard()
      fetchPendingReturns()
    } catch (err) {
      setMsg('error:Failed to approve')
    }
  }

  // Download the PDF the CO attached to this return, so the CCO can review it before approving.
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

  return (
    <div>
      <nav>
        <h1>🛡️ RegulareEdge</h1>
        <div>
          <a href="/cco/dashboard">Dashboard</a>
          <a href="/cco/all-returns">All Returns</a>
          <a href="/cco/all-obligations">All Obligations</a>
          <a href="/cco/calendar">Calendar</a>
          <a href="/cco/all-penalties">All Penalties</a><a href="/notifications">🔔 Notifications</a>  {/* ADD THIS */}

          <a href="/cco/all-audits">Audit Reviews</a>
          <a href="/login">Logout</a>
        </div>
      </nav>

      <div className="page">
        <div style={{marginBottom:'40px', textAlign:'center'}}>
          <h2 style={{
            fontSize:'36px',
            color:'white',
            marginBottom:'8px',
            fontWeight:'700',
            textShadow:'0 2px 4px rgba(0,0,0,0.2)'
          }}>
            👔 Chief Compliance Officer Dashboard
          </h2>
          <p style={{color:'rgba(255,255,255,0.9)',fontSize:'16px',fontWeight:'500'}}>
            Real-time compliance health overview and approval management
          </p>
        </div>

        {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'}>
          {msg.replace('error:', '').replace('success:', '')}
        </div>}

        <div className="dashboard-grid">
          <div className="dashboard-card pending">
            <h4>⏳ Pending Approvals</h4>
            <div className="stat-value" style={{color:'#fb8c00'}}>{dashboard.pendingApprovals}</div>
            <p style={{fontSize:'12px',color:'#666',marginTop:'8px'}}>Returns awaiting your review</p>
          </div>

          <div className="dashboard-card penalties">
            <h4>⚠️ Open Penalties</h4>
            <div className="stat-value" style={{color:'#e53935'}}>{dashboard.openPenalties}</div>
            <p style={{fontSize:'12px',color:'#666',marginTop:'8px'}}>Active penalty proceedings</p>
          </div>

          <div className="dashboard-card penalties">
            <h4>💰 Penalty Exposure</h4>
            <div className="stat-value" style={{color:'#e53935',fontSize:'32px'}}>
              ₹ {dashboard.totalPenaltyAmount?.toLocaleString('en-IN') || '0'}
            </div>
            <p style={{fontSize:'12px',color:'#666',marginTop:'8px'}}>Outstanding penalty amount</p>
          </div>
        </div>

        <div className="card">
          <h2>⏳ Pending Approvals ({pendingReturns.length})</h2>
          <p>Returns requiring your approval before submission to regulators</p>

          {pendingReturns.length === 0 ? (
            <div className="empty-state">
              No pending approvals! All returns are processed.
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Return ID</th>
                    <th>Obligation</th>
                    <th>Period</th>
                    <th>Prepared By</th>
                    <th>Schedules</th>
                    <th>Deadline</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingReturns.map(ret => (
                    <tr key={ret.returnId}>
                      <td><strong>{ret.returnId}</strong></td>
                      <td>{ret.obligationId}</td>
                      <td>{ret.reportingPeriod}</td>
                      <td>{ret.preparedById}</td>
                      <td>{ret.totalSchedules}</td>
                      <td>{ret.submissionDeadline}</td>
                      <td>
                        <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                          <button
                            onClick={() => handleViewData(ret.returnId)}
                            className="btn btn-primary btn-sm"
                          >
                            📄 View Return PDF
                          </button>
                          <button
                            onClick={() => handleApprove(ret.returnId)}
                            className="btn btn-success btn-sm"
                          >
                            ✓ Approve & Submit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h2>⚠️ Open Penalties ({penalties.length})</h2>
          <p>Active penalty proceedings requiring attention</p>

          {penalties.length === 0 ? (
            <div className="empty-state">
              No open penalties! Excellent compliance performance.
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Amount (₹)</th>
                    <th>Dispute</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {penalties.map(p => (
                    <tr key={p.penaltyId}>
                      <td><strong>{p.penaltyId}</strong></td>
                      <td>{p.penaltyType}</td>
                      <td style={{fontWeight:'600',color:'#e53935'}}>
                        ₹ {p.penaltyAmount?.toLocaleString('en-IN')}
                      </td>
                      <td>{p.disputeStatus || 'Not Disputed'}</td>
                      <td>
                        <span className="badge badge-red">OPEN</span>
                      </td>
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

export default CCODashboard