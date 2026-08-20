import { useState, useEffect } from 'react'
import { getUpcomingDeadlines, getOverdueDeadlines } from '../../services/api'

function CalendarView() {
  const [upcoming, setUpcoming] = useState([])
  const [overdue, setOverdue] = useState([])
  const [activeTab, setActiveTab] = useState('upcoming')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetchUpcoming()
    fetchOverdue()
  }, [])

  async function fetchUpcoming() {
    try {
      const res = await getUpcomingDeadlines()
      setUpcoming(res.data)
    } catch (err) {
      setMsg('error:Failed to load')
    }
  }

  async function fetchOverdue() {
    try {
      const res = await getOverdueDeadlines()
      setOverdue(res.data)
    } catch (err) {
      setOverdue([])
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
          <h2>Compliance Calendar</h2>

          <div style={{display:'flex',gap:'10px',marginBottom:'20px',borderBottom:'2px solid #eee'}}>
            <button
              onClick={() => setActiveTab('upcoming')}
              style={{
                padding:'12px 24px',
                border:'none',
                background:'transparent',
                borderBottom: activeTab === 'upcoming' ? '3px solid #1a237e' : 'none',
                color: activeTab === 'upcoming' ? '#1a237e' : '#666',
                fontWeight: activeTab === 'upcoming' ? '600' : '400',
                cursor:'pointer',
                fontSize:'15px'
              }}
            >
              📅 Upcoming ({upcoming.length})
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              style={{
                padding:'12px 24px',
                border:'none',
                background:'transparent',
                borderBottom: activeTab === 'overdue' ? '3px solid #c62828' : 'none',
                color: activeTab === 'overdue' ? '#c62828' : '#666',
                fontWeight: activeTab === 'overdue' ? '600' : '400',
                cursor:'pointer',
                fontSize:'15px'
              }}
            >
              ⚠️ Overdue ({overdue.length})
            </button>
          </div>

          {activeTab === 'upcoming' && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Obligation ID</th>
                  <th>Due Date</th>
                  <th>Cut-off</th>
                  <th>Reminder</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign:'center',padding:'30px'}}>No upcoming deadlines</td></tr>
                ) : upcoming.map(cal => (
                  <tr key={cal.calendarId}>
                    <td>{cal.calendarId}</td>
                    <td>{cal.obligationId}</td>
                    <td><span className="badge badge-blue">{cal.dueDate}</span></td>
                    <td>{cal.dataCutOffDate}</td>
                    <td>{cal.reminderDays} days</td>
                    <td><span className="badge badge-green">{cal.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'overdue' && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Obligation ID</th>
                  <th>Due Date</th>
                  <th>Cut-off</th>
                  <th>Days Late</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {overdue.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign:'center',padding:'40px',color:'#4caf50'}}>
                    <div style={{fontSize:'48px'}}>✅</div>
                    <div style={{fontSize:'16px',fontWeight:'500',marginTop:'8px'}}>No Overdue Deadlines!</div>
                  </td></tr>
                ) : overdue.map(cal => (
                  <tr key={cal.calendarId} style={{background:'#ffebee'}}>
                    <td>{cal.calendarId}</td>
                    <td>{cal.obligationId}</td>
                    <td><span className="badge badge-red">{cal.dueDate}</span></td>
                    <td>{cal.dataCutOffDate}</td>
                    <td><span className="badge badge-red">
                      {Math.floor((new Date() - new Date(cal.dueDate)) / (1000 * 60 * 60 * 24))} days
                    </span></td>
                    <td><span className="badge badge-red">OVERDUE</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarView