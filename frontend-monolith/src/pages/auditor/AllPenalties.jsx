import { useState, useEffect } from 'react'
import { getAllPenalties } from '../../services/api'

function AllPenalties() {
  const [penalties, setPenalties] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPenalties()
  }, [])

  async function fetchPenalties() {
    setLoading(true)
    try {
      const res = await getAllPenalties()
      setPenalties(res.data)
    } catch (err) {
      console.error('Failed to load penalties')
    } finally {
      setLoading(false)
    }
  }

  function getStatusBadge(status) {
    const colors = {
      'OPEN': 'badge-red',
      'PAID': 'badge-green',
      'APPEALING': 'badge-orange',
      'CLOSED': 'badge-gray'
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
          <h2>All Penalties (Audit View)</h2>
          <p style={{color:'#666',fontSize:'14px',marginBottom:'20px'}}>
            View all penalties for audit purposes (read-only access)
          </p>

          {loading ? (
            <p style={{textAlign:'center',padding:'20px'}}>Loading...</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Obligation ID</th>
                    <th>Type</th>
                    <th>Amount (₹)</th>
                    <th>Dispute</th>
                    <th>Paid Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {penalties.length === 0 ? (
                    <tr><td colSpan="7" style={{textAlign:'center',padding:'20px',color:'#888'}}>No penalties found</td></tr>
                  ) : penalties.map(p => (
                    <tr key={p.penaltyId}>
                      <td>{p.penaltyId}</td>
                      <td>{p.obligationId || '-'}</td>
                      <td>{p.penaltyType}</td>
                      <td>₹ {p.penaltyAmount?.toLocaleString('en-IN')}</td>
                      <td>{p.disputeStatus || 'Not Disputed'}</td>
                      <td>{p.paidDate || '-'}</td>
                      <td>{getStatusBadge(p.status)}</td>
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

export default AllPenalties