import { useState, useEffect } from 'react'
import { getAllAuditsRaw } from '../../services/api'

function AllAudits() {
  const [audits, setAudits] = useState([])
  const [msg, setMsg] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchAudits()
  }, [])

  async function fetchAudits() {
    try {
      const res = await getAllAuditsRaw()
      setAudits(res.data)
    } catch (err) {
      setMsg('error:Failed to load audits')
    }
  }

  const filteredAudits = filter === 'all' 
    ? audits 
    : audits.filter(a => a.rating === filter)

  const ratingCounts = {
    satisfactory: audits.filter(a => a.rating === 'SATISFACTORY').length,
    needsImprovement: audits.filter(a => a.rating === 'NEEDS_IMPROVEMENT').length,
    unsatisfactory: audits.filter(a => a.rating === 'UNSATISFACTORY').length
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
          <h2>Audit Reviews</h2>
          <p style={{color:'#666',marginBottom:'16px'}}>Quality assessment of compliance processes</p>

          {/* RATING SUMMARY */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'16px',marginBottom:'24px'}}>
            <div style={{background:'#e8f5e9',padding:'16px',borderRadius:'8px',textAlign:'center'}}>
              <div style={{fontSize:'32px',fontWeight:'700',color:'#2e7d32'}}>{ratingCounts.satisfactory}</div>
              <div style={{fontSize:'13px',color:'#666',marginTop:'4px'}}>SATISFACTORY</div>
            </div>
            <div style={{background:'#fff3e0',padding:'16px',borderRadius:'8px',textAlign:'center'}}>
              <div style={{fontSize:'32px',fontWeight:'700',color:'#f57f17'}}>{ratingCounts.needsImprovement}</div>
              <div style={{fontSize:'13px',color:'#666',marginTop:'4px'}}>NEEDS_IMPROVEMENT</div>
            </div>
            <div style={{background:'#ffebee',padding:'16px',borderRadius:'8px',textAlign:'center'}}>
              <div style={{fontSize:'32px',fontWeight:'700',color:'#c62828'}}>{ratingCounts.unsatisfactory}</div>
              <div style={{fontSize:'13px',color:'#666',marginTop:'4px'}}>UNSATISFACTORY</div>
            </div>
          </div>

          <div className="filters">
            <button className={`btn ${filter === 'all' ? 'btn-primary' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`btn ${filter === 'SATISFACTORY' ? 'btn-primary' : ''}`} onClick={() => setFilter('SATISFACTORY')}>Satisfactory</button>
            <button className={`btn ${filter === 'NEEDS_IMPROVEMENT' ? 'btn-primary' : ''}`} onClick={() => setFilter('NEEDS_IMPROVEMENT')}>Needs Work</button>
            <button className={`btn ${filter === 'UNSATISFACTORY' ? 'btn-primary' : ''}`} onClick={() => setFilter('UNSATISFACTORY')}>Critical</button>
          </div>

          {msg && <div className="msg-error">{msg.replace('error:', '')}</div>}

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Obligation</th>
                <th>Period</th>
                <th>Auditor</th>
                <th>Review Date</th>
                <th>Rating</th>
                <th>Findings</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign:'center',padding:'30px'}}>No audits yet</td></tr>
              ) : filteredAudits.map(aud => (
                <tr key={aud.reviewId}>
                  <td>{aud.reviewId}</td>
                  <td>{aud.obligationId}</td>
                  <td><strong>{aud.reviewPeriod}</strong></td>
                  <td>User #{aud.auditedById}</td>
                  <td>{aud.reviewDate}</td>
                  <td>
                    <span className={`badge ${
                      aud.rating === 'SATISFACTORY' ? 'badge-green' :
                      aud.rating === 'NEEDS_IMPROVEMENT' ? 'badge-orange' : 'badge-red'
                    }`}>
                      {aud.rating}
                    </span>
                  </td>
                  <td style={{fontSize:'12px',maxWidth:'300px'}}>{aud.findings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AllAudits