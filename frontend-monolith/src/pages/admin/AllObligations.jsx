import { useState, useEffect } from 'react'
import { getAllObligations, getActiveObligations, updateObligationStatus } from '../../services/api.js'

function AllObligations() {
  const [obligations, setObligations] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true); setMsg('')
    try {
      const res = await getAllObligations()
      setObligations(res.data)
    } catch (err) { setMsg('error:Failed to load obligations.') }
    finally { setLoading(false) }
  }

  async function fetchActive() {
    setLoading(true); setMsg('')
    try {
      const res = await getActiveObligations()
      setObligations(res.data)
    } catch (err) { setMsg('error:Failed to load.') }
    finally { setLoading(false) }
  }

  async function handleStatusUpdate(obligationId, status) {
    if (!status) return
    try {
      await updateObligationStatus({ obligationId, status })
      setMsg('success:Status updated successfully!')
      fetchAll()
    } catch (err) { setMsg('error:Update failed.') }
  }

  return (
    <div>
<nav>
  <h1>RegulareEdge</h1>
  <div>
    <a href="/admin/add-regulator">Add Regulator</a>
    <a href="/admin/add-obligation">Add Obligation</a>
    <a href="/admin/add-deadline">Add Deadline</a>
    <a href="/admin/all-obligations">All Obligations</a>
    <a href="/users">All Users</a>
    <a href="/register">Add User</a>
    <a href="/admin/calendar">View Calendar</a>
    <a href="/login">Logout</a>
  </div>
</nav>
      <div className="page">
        <div className="card">
          <h2>All Regulatory Obligations ({obligations.length})</h2>
          <div className="filter-row">
            <button className="btn btn-primary" onClick={fetchAll}>Show All</button>
            <button className="btn btn-secondary" onClick={fetchActive}>Active Only</button>
          </div>
          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'} style={{ marginBottom: '14px' }}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Return Name</th><th>Code</th><th>Frequency</th><th>Mode</th><th>Owner ID</th><th>Status</th><th>Change</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
                ) : obligations.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No obligations found</td></tr>
                ) : obligations.map((o) => (
                  <tr key={o.obligationId}>
                    <td><strong>{o.obligationId}</strong></td>
                    <td>{o.returnName}</td>
                    <td>{o.returnCode}</td>
                    <td><span className="badge badge-blue">{o.frequency}</span></td>
                    <td>{o.submissionMode}</td>
                    <td>User #{o.ownerId}</td>
                    <td><span className={`badge ${o.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{o.status}</span></td>
                    <td>
                      <select onChange={(e) => handleStatusUpdate(o.obligationId, e.target.value)}
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}>
                        <option value="">-- Change --</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Discontinued">Discontinued</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllObligations