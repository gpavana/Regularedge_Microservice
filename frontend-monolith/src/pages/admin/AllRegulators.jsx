import { useState, useEffect } from 'react'
import { getAllRegulators, getActiveRegulators, deleteRegulator } from '../../services/api.js'

function AllRegulators() {
  const [regulators, setRegulators] = useState([])
  const [msg, setMsg]               = useState('')
  const [loading, setLoading]       = useState(false)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true); setMsg('')
    try {
      const res = await getAllRegulators()
      setRegulators(res.data)
    } catch (err) { setMsg('error:Failed to load regulators.') }
    finally { setLoading(false) }
  }

  async function fetchActive() {
    setLoading(true); setMsg('')
    try {
      const res = await getActiveRegulators()
      setRegulators(res.data)
    } catch (err) { setMsg('error:Failed to load.') }
    finally { setLoading(false) }
  }

  async function handleDelete(name) {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return
    try {
      await deleteRegulator({ name })
      setMsg('success:Regulator deleted successfully!')
      fetchAll()
    } catch (err) { setMsg('error:Delete failed.') }
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
    <a href="/admin/calendar">View Calendar</a>
    <a href="/users">All Users</a>
    <a href="/register">Add User</a>
    <a href="/login">Logout</a>
  </div>
</nav>
      <div className="page">
        <div className="card">
          <h2>All Regulators ({regulators.length})</h2>
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
                <tr><th>ID</th><th>Name</th><th>Jurisdiction</th><th>Domain</th><th>Contact</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
                ) : regulators.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No regulators found</td></tr>
                ) : regulators.map((r) => (
                  <tr key={r.regulatorId}>
                    <td>{r.regulatorId}</td>
                    <td><strong>{r.name}</strong></td>
                    <td>{r.jurisdiction}</td>
                    <td><span className="badge badge-blue">{r.regulatoryDomain}</span></td>
                    <td>{r.contactDetails}</td>
                    <td><span className={`badge ${r.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{r.status}</span></td>
                    <td>
                      <button className="btn btn-danger" style={{ padding: '5px 12px', fontSize: '12px' }}
                        onClick={() => handleDelete(r.name)}>Delete</button>
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

export default AllRegulators