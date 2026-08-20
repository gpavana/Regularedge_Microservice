import { useState, useEffect } from 'react'
import api from '../../services/api'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  async function fetchNotifications() {
    setLoading(true)
    try {
      const endpoint = filter === 'unread'
        ? `/notifications/unread/${userId}`
        : `/notifications/my/${userId}`
      const res = await api.get(endpoint, filter === 'unread' ? undefined : { params: { size: 200 } })
      setNotifications(filter === 'unread' ? res.data : res.data.content || [])
    } catch (err) {
      console.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkAsRead(notificationId) {
    try {
      await api.put(`/notifications/markRead/${notificationId}`)
      fetchNotifications()
    } catch (err) {
      console.error('Failed to mark as read')
    }
  }

  async function handleMarkAllRead() {
    try {
      await api.put(`/notifications/markAllRead/${userId}`)
      fetchNotifications()
    } catch (err) {
      console.error('Failed to mark all as read')
    }
  }

  function getCategoryIcon(category) {
    const icons = {
      'OBLIGATION': '📋',
      'DATA_COLLECTION': '📊',
      'RETURN': '📄',
      'CORRESPONDENCE': '✉️',
      'PENALTY': '⚠️',
      'AUDIT': '🔍'
    }
    return icons[category] || '🔔'
  }

  function getCategoryColor(category) {
    const colors = {
      'OBLIGATION': '#1976d2',
      'DATA_COLLECTION': '#43a047',
      'RETURN': '#fb8c00',
      'CORRESPONDENCE': '#00acc1',
      'PENALTY': '#e53935',
      'AUDIT': '#5e35b1'
    }
    return colors[category] || '#666'
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length

  return (
    <div>
      <nav>
        <h1>🛡️ RegulareEdge</h1>
        <div>
          <a href="/notifications">🔔 Notifications {unreadCount > 0 && `(${unreadCount})`}</a>
          <a href="/login">Logout</a>
        </div>
      </nav>

      <div className="page">
        <div style={{marginBottom:'32px', textAlign:'center'}}>
          <h2 style={{
            fontSize:'36px',
            color:'white',
            marginBottom:'8px',
            fontWeight:'700',
            textShadow:'0 2px 4px rgba(0,0,0,0.2)'
          }}>
            🔔 Notifications
          </h2>
          <p style={{color:'rgba(255,255,255,0.9)',fontSize:'16px',fontWeight:'500'}}>
            Stay updated with important compliance alerts
          </p>
        </div>

        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px',flexWrap:'wrap',gap:'12px'}}>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding:'10px 14px',
                borderRadius:'8px',
                border:'2px solid #e0e0e0',
                fontSize:'14px',
                background:'white'
              }}
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only ({unreadCount})</option>
            </select>
            {unreadCount > 0 && (
              <button className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
                ✓ Mark All Read
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading">Loading notifications</div>
          ) : notifications.length === 0 ? (
            <div className="empty-state">
              {filter === 'unread' ? 'No unread notifications! You\'re all caught up 🎉' : 'No notifications yet'}
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {notifications.map(notif => (
                <div
                  key={notif.notificationId}
                  style={{
                    background: notif.status === 'UNREAD' 
                      ? 'linear-gradient(135deg, #f0f2ff 0%, #e8eaf6 100%)'
                      : 'white',
                    border: notif.status === 'UNREAD'
                      ? '2px solid #667eea'
                      : '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'start',
                    transition: 'all 0.3s ease',
                    cursor: notif.status === 'UNREAD' ? 'pointer' : 'default'
                  }}
                  onClick={() => notif.status === 'UNREAD' && handleMarkAsRead(notif.notificationId)}
                  onMouseEnter={(e) => {
                    if (notif.status === 'UNREAD') {
                      e.currentTarget.style.transform = 'translateX(4px)'
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{
                    fontSize: '32px',
                    minWidth: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'white',
                    borderRadius: '50%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div style={{flex: 1}}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '8px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: getCategoryColor(notif.category),
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {notif.category}
                      </span>
                      <span style={{fontSize: '12px', color: '#999'}}>
                        {formatDate(notif.createdDate)}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '15px',
                      color: '#333',
                      fontWeight: notif.status === 'UNREAD' ? '600' : '400',
                      lineHeight: '1.5'
                    }}>
                      {notif.message}
                    </p>
                  </div>

                  {notif.status === 'UNREAD' && (
                    <div style={{
                      width: '10px',
                      height: '10px',
                      background: '#667eea',
                      borderRadius: '50%',
                      marginTop: '8px',
                      boxShadow: '0 0 8px rgba(102, 126, 234, 0.5)'
                    }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications