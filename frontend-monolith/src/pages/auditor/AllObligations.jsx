import { useState, useEffect } from 'react'
import { getAllObligations } from '../../services/api'

function AllObligations() {
  const [obligations, setObligations] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchObligations()
  }, [])

  async function fetchObligations() {
    setLoading(true)
    try {
      const res = await getAllObligations()
      setObligations(res.data)
    } catch (err) {
      console.error('Failed to load obligations')
    } finally {
      setLoading(false)
    }
  }

  function getStatusBadge(status) {
    return <span className={status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}>{status}</span>
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
          <h2>All Regulatory Obligations (Audit View)</h2>
          <p style={{color:'#666',fontSize:'14px',marginBottom:'20px'}}>
            View all compliance obligations for audit purposes
          </p>

          {loading ? (
            <p style={{textAlign:'center',padding:'20px'}}>Loading...</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Obligation ID</th>
                    <th>Regulator ID</th>
                    <th>Return Name</th>
                    <th>Return Code</th>
                    <th>Frequency</th>
                    <th>Submission Mode</th>
                    <th>Owner ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {obligations.length === 0 ? (
                    <tr><td colSpan="8" style={{textAlign:'center',padding:'20px',color:'#888'}}>No obligations found</td></tr>
                  ) : obligations.map(obl => (
                    <tr key={obl.obligationId}>
                      <td>{obl.obligationId}</td>
                      <td>{obl.regulatorId}</td>
                      <td>{obl.returnName}</td>
                      <td>{obl.returnCode}</td>
                      <td>{obl.frequency}</td>
                      <td>{obl.submissionMode}</td>
                      <td>{obl.ownerId}</td>
                      <td>{getStatusBadge(obl.status)}</td>
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

export default AllObligations