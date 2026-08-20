import { useState } from 'react'
import { addRegulator } from '../../services/api.js'

function AddRegulator() {
  const [form, setForm] = useState({
    name: '', jurisdiction: '', regulatoryDomain: 'Banking', contactDetails: '', status: 'Active'
  })
  const [msg, setMsg]         = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  async function handleSubmit() {
    if (!form.name || !form.jurisdiction) {
      setMsg('error:Please fill all required fields!'); return
    }
    setLoading(true); setMsg('')
    try {
      const res = await addRegulator(form)
      if (res.status === 201 || res.status === 200) {
        setMsg('success:Regulator added successfully!')
        setForm({ name: '', jurisdiction: '', regulatoryDomain: 'Banking', contactDetails: '', status: 'Active' })
      }
    } catch (err) {
      if (err.response && err.response.status === 409) setMsg('error:Regulator already exists!')
      else setMsg('error:Something went wrong.')
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
    <a href="/admin/calendar">View Calendar</a>
    <a href="/users">All Users</a>
    <a href="/register">Add User</a>
    <a href="/login">Logout</a>
  </div>
</nav>
      <div className="page">
        <div className="card" style={{ maxWidth: '550px', margin: '30px auto' }}>
          <h2>Add Regulator</h2>
          <div className="form-group">
            <label>Regulator Name * (e.g. RBI, SEBI)</label>
            <input name="name" placeholder="Enter regulator name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Jurisdiction *</label>
            <input name="jurisdiction" placeholder="e.g. India" value={form.jurisdiction} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Contact Details</label>
            <input name="contactDetails" placeholder="Enter contact email or phone" value={form.contactDetails} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Regulatory Domain</label>
            <select name="regulatoryDomain" value={form.regulatoryDomain} onChange={handleChange}>
              <option value="Banking">Banking</option>
              <option value="Insurance">Insurance</option>
              <option value="Securities">Securities</option>
              <option value="Payments">Payments</option>
              <option value="AML">AML</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Regulator'}
          </button>
          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}
        </div>
      </div>
    </div>
  )
}

export default AddRegulator