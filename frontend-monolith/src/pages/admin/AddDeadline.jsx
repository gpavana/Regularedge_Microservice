import { useState, useEffect } from 'react'
import { addDeadline, getAllObligations } from '../../services/api.js'

function AddDeadline() {
  const [form, setForm] = useState({
    obligationId: '',
    dueDate: '',
    dataCutOffDate: '',
    reminderDays: '7',
    status: 'UPCOMING'
  })
  const [obligations, setObligations] = useState([])
  const [msg, setMsg]         = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllObligations().then(res => setObligations(res.data)).catch(() => {})
  }, [])

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  async function handleSubmit() {
    if (!form.obligationId || !form.dueDate) {
      setMsg('error:Please fill all required fields!'); return
    }
    setLoading(true); setMsg('')
    try {
      const res = await addDeadline(form)
      if (res.status === 201 || res.status === 200) {
        setMsg('success:Deadline added successfully!')
        setForm({ obligationId: '', dueDate: '', dataCutOffDate: '', reminderDays: '7', status: 'UPCOMING' })
      }
    } catch (err) {
      setMsg('error:Something went wrong.')
    } finally { setLoading(false) }
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
        <div className="card" style={{ maxWidth: '550px', margin: '30px auto' }}>
          <h2>Add Compliance Deadline</h2>

          <div className="form-group">
            <label>Select Obligation *</label>
            <select name="obligationId" value={form.obligationId} onChange={handleChange}>
              <option value="">-- Select Obligation --</option>
              {obligations.map(o => (
                <option key={o.obligationId} value={o.obligationId}>
                  {o.returnName} ({o.frequency})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Due Date * (When to submit)</label>
            <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Data Cut Off Date (Last date for data collection)</label>
            <input name="dataCutOffDate" type="date" value={form.dataCutOffDate} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Reminder Days (Remind how many days before)</label>
            <input name="reminderDays" type="number" placeholder="e.g. 7" value={form.reminderDays} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="UPCOMING">UPCOMING</option>
              <option value="DATA_COLLECTION">DATA COLLECTION</option>
              <option value="IN_PREPARATION">IN PREPARATION</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="OVERDUE">OVERDUE</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Deadline'}
          </button>

          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}
        </div>
      </div>
    </div>
  )
}

export default AddDeadline