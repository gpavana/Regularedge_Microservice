import { useState, useEffect } from 'react'
import { getUpcomingDeadlines, getOverdueDeadlines } from '../../services/api'

function CalendarView() {
  const [upcoming, setUpcoming] = useState([])
  const [overdue, setOverdue] = useState([])
  const [activeTab, setActiveTab] = useState('upcoming')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUpcoming()
    fetchOverdue()
  }, [])

  async function fetchUpcoming() {
    setLoading(true)
    try {
      const res = await getUpcomingDeadlines()
      setUpcoming(res.data)
    } catch (err) {
      setMsg('error:Failed to load upcoming deadlines')
    } finally {
      setLoading(false)
    }
  }

  async function fetchOverdue() {
    try {
      const res = await getOverdueDeadlines()
      setOverdue(res.data)
    } catch (err) {
      console.error('Failed to load overdue')
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
          <h2>Compliance Calendar</h2>

          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}

          {/* TABS */}
          <div style={{display:'flex',gap:'10px',marginBottom:'20px',borderBottom:'2px solid #eee'}}>
            <button
              onClick={() => setActiveTab('upcoming')}
              style={{
                padding:'10px 20px',
                border:'none',
                background:'transparent',
                borderBottom: activeTab === 'upcoming' ? '3px solid #1a237e' : 'none',
                color: activeTab === 'upcoming' ? '#1a237e' : '#666',
                fontWeight: activeTab === 'upcoming' ? '600' : '400',
                cursor:'pointer'
              }}
            >
              Upcoming ({upcoming.length})
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              style={{
                padding:'10px 20px',
                border:'none',
                background:'transparent',
                borderBottom: activeTab === 'overdue' ? '3px solid #c62828' : 'none',
                color: activeTab === 'overdue' ? '#c62828' : '#666',
                fontWeight: activeTab === 'overdue' ? '600' : '400',
                cursor:'pointer'
              }}
            >
              Overdue ({overdue.length})
            </button>
          </div>

          {loading ? (
            <p style={{textAlign:'center',padding:'20px',color:'#888'}}>Loading...</p>
          ) : (
            <>
              {/* UPCOMING TAB */}
              {activeTab === 'upcoming' && (
                <table>
                  <thead>
                    <tr>
                      <th>Calendar ID</th>
                      <th>Obligation ID</th>
                      <th>Due Date</th>
                      <th>Cut-off Date</th>
                      <th>Reminder Days</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming.length === 0 ? (
                      <tr><td colSpan="6" style={{textAlign:'center',padding:'20px',color:'#888'}}>No upcoming deadlines</td></tr>
                    ) : upcoming.map((cal) => (
                      <tr key={cal.calendarId}>
                        <td>{cal.calendarId}</td>
                        <td>{cal.obligationId}</td>
                        <td><span className="badge badge-blue">{cal.dueDate}</span></td>
                        <td>{cal.dataCutOffDate}</td>
                        <td>{cal.reminderDays} days before</td>
                        <td><span className="badge badge-green">{cal.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* OVERDUE TAB */}
              {activeTab === 'overdue' && (
                <table>
                  <thead>
                    <tr>
                      <th>Calendar ID</th>
                      <th>Obligation ID</th>
                      <th>Due Date</th>
                      <th>Cut-off Date</th>
                      <th>Days Overdue</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overdue.length === 0 ? (
                      <tr><td colSpan="6" style={{textAlign:'center',padding:'20px',color:'#4caf50'}}>✅ No overdue deadlines! Great job!</td></tr>
                    ) : overdue.map((cal) => (
                      <tr key={cal.calendarId} style={{background:'#ffebee'}}>
                        <td>{cal.calendarId}</td>
                        <td>{cal.obligationId}</td>
                        <td><span className="badge badge-red">{cal.dueDate}</span></td>
                        <td>{cal.dataCutOffDate}</td>
                        <td>
                          <span className="badge badge-red">
                            {Math.floor((new Date() - new Date(cal.dueDate)) / (1000 * 60 * 60 * 24))} days late
                          </span>
                        </td>
                        <td><span className="badge badge-red">{cal.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarView