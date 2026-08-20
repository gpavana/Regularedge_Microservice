import { useState, useEffect } from 'react'
import { getAllObligations } from '../../services/api'

function AllObligations() {
  const [obligations, setObligations] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetchObligations()
  }, [])

  async function fetchObligations() {
    try {
      const res = await getAllObligations()
      setObligations(res.data)
    } catch (err) {
      setMsg('error:Failed to load')
    }
  }

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
          <h2>All Regulatory Obligations</h2>
          <p style={{color:'#666',marginBottom:'16px'}}>Complete list of compliance requirements</p>

          {msg && <div className="msg-error">{msg.replace('error:', '')}</div>}

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Return Name</th>
                <th>Code</th>
                <th>Frequency</th>
                <th>Owner</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {obligations.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign:'center',padding:'30px'}}>No obligations</td></tr>
              ) : obligations.map(obl => (
                <tr key={obl.obligationId}>
                  <td>{obl.obligationId}</td>
                  <td><strong>{obl.returnName}</strong></td>
                  <td>{obl.returnCode}</td>
                  <td><span className="badge badge-blue">{obl.frequency}</span></td>
                  <td>User #{obl.ownerId}</td>
                  <td><span className={`badge ${obl.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{obl.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AllObligations