import { useState, useEffect } from 'react'
import { addObligation, getAllRegulators, getAllUsers } from '../../services/api.js'

function AddObligation() {
  const [form, setForm] = useState({
    regulatorId: '', returnName: '', returnCode: '', frequency: 'MONTHLY',
    submissionMode: 'Portal', returnTemplateRef: '', ownerId: '', status: 'Active'
  })
  const [regulators, setRegulators] = useState([])
  const [users, setUsers] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllRegulators().then(res => setRegulators(res.data)).catch(() => {})
    getAllUsers().then(res => setUsers(res.data.filter(u => u.role === 'COMPLIANCE_OFFICER'))).catch(() => {})
  }, [])

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  async function handleSubmit() {
    if (!form.regulatorId || !form.returnName || !form.ownerId) {
      setMsg('error:Please fill all required fields!'); return
    }
    setLoading(true); setMsg('')
    try {
      const res = await addObligation(form)
      if (res.status === 201 || res.status === 200) {
        setMsg('success:Obligation added successfully!')
        setForm({ regulatorId: '', returnName: '', returnCode: '', frequency: 'MONTHLY',
          submissionMode: 'Portal', returnTemplateRef: '', ownerId: '', status: 'Active' })
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
        <div className="card" style={{ maxWidth: '600px', margin: '30px auto' }}>
          <h2>Add Regulatory Obligation</h2>

          <div className="form-group">
            <label>Regulator *</label>
            <select name="regulatorId" value={form.regulatorId} onChange={handleChange}>
              <option value="">-- Select Regulator --</option>
              {regulators.map(r => (
                <option key={r.regulatorId} value={r.regulatorId}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Return Name * (e.g. Monthly Loan Report)</label>
            <input name="returnName" placeholder="Enter return name" value={form.returnName} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Return Code (e.g. RBI-MLR-001)</label>
            <input name="returnCode" placeholder="Enter return code" value={form.returnCode} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Frequency</label>
            <select name="frequency" value={form.frequency} onChange={handleChange}>
              <option value="DAILY">DAILY</option>
              <option value="MONTHLY">MONTHLY</option>
              <option value="QUARTERLY">QUARTERLY</option>
              <option value="ANNUAL">ANNUAL</option>
              <option value="AD_HOC">AD HOC</option>
            </select>
          </div>

          <div className="form-group">
            <label>Submission Mode</label>
            <select name="submissionMode" value={form.submissionMode} onChange={handleChange}>
              <option value="Portal">Portal</option>
              <option value="Email">Email</option>
              <option value="System">System</option>
            </select>
          </div>

          <div className="form-group">
            <label>Template Reference (e.g. template_loan.xlsx)</label>
            <input name="returnTemplateRef" placeholder="Enter template file name" value={form.returnTemplateRef} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Assign to Compliance Officer *</label>
            <select name="ownerId" value={form.ownerId} onChange={handleChange}>
              <option value="">-- Select CO --</option>
              {users.map(u => (
                <option key={u.userId} value={u.userId}>{u.name} (ID: {u.userId})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Obligation'}
          </button>

          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}
        </div>
      </div>
    </div>
  )
}

export default AddObligation