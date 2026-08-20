import { useState, useEffect } from 'react'
import { getAllUsers, updateUserStatus, deleteUser } from '../../services/api'

function AllUsers() {
  const [users, setUsers] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [filterRole, setFilterRole] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    try {
      const res = await getAllUsers()
      setUsers(res.data)
    } catch (err) {
      setMsg('error:Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusToggle(userId, currentStatus) {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    
    if (!window.confirm(`Change status to ${newStatus}?`)) return

    try {
      await updateUserStatus({ userId, status: newStatus })
      setMsg('success:Status updated successfully!')
      fetchUsers()
    } catch (err) {
      setMsg('error:Failed to update status')
    }
  }

  async function handleDelete(email) {
    if (!window.confirm(`Delete user ${email}? This cannot be undone!`)) return

    try {
      await deleteUser({ email })
      setMsg('success:User deleted successfully!')
      fetchUsers()
    } catch (err) {
      setMsg('error:Failed to delete user')
    }
  }

  function getRoleBadge(role) {
    const roleConfig = {
      'ADMIN': { class: 'badge-purple', icon: '👑' },
      'CCO': { class: 'badge-blue', icon: '👔' },
      'COMPLIANCE_OFFICER': { class: 'badge-green', icon: '📊' },
      'DATA_OWNER': { class: 'badge-orange', icon: '📁' },
      'LEGAL_OFFICER': { class: 'badge-red', icon: '⚖️' },
      'INTERNAL_AUDITOR': { class: 'badge-gray', icon: '🔍' }
    }
    const config = roleConfig[role] || { class: 'badge-gray', icon: '👤' }
    return <span className={`badge ${config.class}`}>{config.icon} {role.replace('_', ' ')}</span>
  }

  const filteredUsers = filterRole 
    ? users.filter(u => u.role === filterRole)
    : users

  return (
    <div>
<nav>
  <h1>RegulareEdge</h1>
  <div>
    <a href="/admin/add-regulator">Add Regulator</a>
    <a href="/admin/add-obligation">Add Obligation</a>
    <a href="/admin/add-deadline">Add Deadline</a>
    <a href="/admin/all-obligations">All Obligations</a>
    <a href="/admin/calendar">View Calendar</a> 
        <a href="/notifications">🔔 Notifications</a>  {/* ADD THIS */}

    <a href="/users">All Users</a>
    <a href="/register">Add User</a>
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
            👥 User Management
          </h2>
          <p style={{color:'rgba(255,255,255,0.9)',fontSize:'16px',fontWeight:'500'}}>
            Manage system users and their access levels
          </p>
        </div>

        <div className="card">
          <h2>All Users ({filteredUsers.length})</h2>
          <p>Manage user accounts, roles, and access permissions</p>

          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}

          <div className="filter-row">
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              style={{minWidth:'200px'}}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">👑 ADMIN</option>
              <option value="CCO">👔 CCO</option>
              <option value="COMPLIANCE_OFFICER">📊 COMPLIANCE OFFICER</option>
              <option value="DATA_OWNER">📁 DATA OWNER</option>
              <option value="LEGAL_OFFICER">⚖️ LEGAL OFFICER</option>
              <option value="INTERNAL_AUDITOR">🔍 INTERNAL AUDITOR</option>
            </select>
            <button className="btn btn-secondary btn-sm" onClick={() => setFilterRole('')}>
              Clear Filter
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Business Unit</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" className="loading">Loading users</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="8" className="empty-state">No users found</td></tr>
                ) : filteredUsers.map(user => (
                  <tr key={user.userId}>
                    <td><strong>{user.userId}</strong></td>
                    <td style={{fontWeight:'600'}}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.businessUnitId}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>
                      <span className={user.status === 'ACTIVE' ? 'badge badge-green' : 'badge badge-gray'}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                        <button
                          onClick={() => handleStatusToggle(user.userId, user.status)}
                          className="btn btn-sm"
                          style={{
                            background: user.status === 'ACTIVE' ? 
                              'linear-gradient(135deg, #ff9800 0%, #fb8c00 100%)' : 
                              'linear-gradient(135deg, #43a047 0%, #66bb6a 100%)',
                            color: 'white',
                            padding: '6px 12px',
                            fontSize: '12px'
                          }}
                        >
                          {user.status === 'ACTIVE' ? '⏸ Deactivate' : '▶ Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(user.email)}
                          className="btn btn-danger btn-sm"
                          style={{padding: '6px 12px', fontSize: '12px'}}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="stats-row" style={{marginTop:'32px'}}>
          <div className="stat-card">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <h3>{users.filter(u => u.status === 'ACTIVE').length}</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-card">
            <h3>{new Set(users.map(u => u.role)).size}</h3>
            <p>Different Roles</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllUsers