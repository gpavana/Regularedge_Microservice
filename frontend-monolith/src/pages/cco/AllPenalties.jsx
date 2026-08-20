import { useState, useEffect } from 'react'
import { getAllPenalties } from '../../services/api'

function AllPenalties() {
  const [penalties, setPenalties] = useState([])
  const [msg, setMsg] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchPenalties()
  }, [])

  async function fetchPenalties() {
    try {
      const res = await getAllPenalties()
      setPenalties(res.data)
    } catch (err) {
      setMsg('error:Failed to load penalties')
    }
  }

  const filteredPenalties = filter === 'all' 
    ? penalties 
    : penalties.filter(p => p.status === filter)

  const totalOpen = penalties.filter(p => p.status === 'OPEN').reduce((sum, p) => sum + p.penaltyAmount, 0)

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
          <h2>All Penalties</h2>
          <p style={{color:'#666',marginBottom:'16px'}}>Complete penalty tracking and exposure</p>

          <div style={{background:'#ffebee',padding:'16px',borderRadius:'8px',marginBottom:'20px',border:'1px solid #ffcdd2'}}>
            <div style={{fontSize:'14px',color:'#666'}}>Total Open Penalty Exposure</div>
            <div style={{fontSize:'32px',fontWeight:'700',color:'#c62828',marginTop:'4px'}}>
              ₹{totalOpen.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="filters">
            <button className={`btn ${filter === 'all' ? 'btn-primary' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`btn ${filter === 'OPEN' ? 'btn-primary' : ''}`} onClick={() => setFilter('OPEN')}>Open</button>
            <button className={`btn ${filter === 'PAID' ? 'btn-primary' : ''}`} onClick={() => setFilter('PAID')}>Paid</button>
          </div>

          {msg && <div className="msg-error">{msg.replace('error:', '')}</div>}

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Dispute Status</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPenalties.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign:'center',padding:'40px',color:'#4caf50'}}>
                  <div style={{fontSize:'48px'}}>✅</div>
                  <div style={{fontSize:'16px',fontWeight:'500',marginTop:'8px'}}>No Penalties!</div>
                </td></tr>
              ) : filteredPenalties.map(p => (
                <tr key={p.penaltyId}>
                  <td>{p.penaltyId}</td>
                  <td>{p.penaltyType}</td>
                  <td><strong>₹{p.penaltyAmount?.toLocaleString('en-IN')}</strong></td>
                  <td>{p.disputeStatus}</td>
                  <td><span className={`badge ${p.status === 'PAID' ? 'badge-green' : 'badge-red'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AllPenalties