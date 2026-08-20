import { useState, useEffect } from 'react'
import { createDataRequest, getUsersByRole, getUpcomingDeadlines } from '../../services/api'

function CreateDataRequest() {
  const [form, setForm] = useState({
    calendarId: '',
    dataOwnerId: '',
    dataDescription: '',
    dataCutOffDate: '',
    submissionDeadline: '',
    status: 'SENT'
  })
  const [dataOwners, setDataOwners] = useState([])
  const [deadlines, setDeadlines] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    loadDataOwners()
    loadDeadlines()
  }, [])

  async function loadDataOwners() {
    try {
      const res = await getUsersByRole('DATA_OWNER')
      setDataOwners(res.data)
    } catch (err) {
      console.error('Failed to load data owners:', err)
      setMsg('error:Failed to load data owners')
    }
  }

  async function loadDeadlines() {
    try {
      const res = await getUpcomingDeadlines()
      setDeadlines(res.data)
    } catch (err) {
      setMsg('error:Failed to load deadlines')
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!form.dataOwnerId || !form.dataDescription) {
      setMsg('error:Please fill required fields')
      return
    }

    try {
      await createDataRequest(form)
      setMsg('success:Data request sent!')
      setForm({
        calendarId: '',
        dataOwnerId: '',
        dataDescription: '',
        dataCutOffDate: '',
        submissionDeadline: '',
        status: 'SENT'
      })
    } catch (err) {
      setMsg('error:Failed to send request')
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
        <div className="card" style={{maxWidth:'700px',margin:'30px auto'}}>
          <h2>Create Data Request</h2>

          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}

          <div className="form-group">
            <label>Select Data Owner *</label>
            <select name="dataOwnerId" value={form.dataOwnerId} onChange={handleChange}>
              <option value="">-- Choose Data Owner --</option>
              {dataOwners.map(owner => (
                <option key={owner.userId} value={owner.userId}>
                  {owner.name} (ID: {owner.userId}) - {owner.email}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Calendar Deadline</label>
            <select name="calendarId" value={form.calendarId} onChange={handleChange}>
              <option value="">-- Choose Deadline --</option>
              {deadlines.map(d => (
                <option key={d.calendarId} value={d.calendarId}>
                  Due: {d.dueDate} (Cut-off: {d.dataCutOffDate})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Data Description *</label>
            <textarea
              name="dataDescription"
              value={form.dataDescription}
              onChange={handleChange}
              placeholder="e.g., May 2026 Loan Data - Total loans, home loans, personal loans, NPA details"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Data Cut-off Date</label>
            <input
              name="dataCutOffDate"
              type="date"
              value={form.dataCutOffDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Submission Deadline</label>
            <input
              name="submissionDeadline"
              type="date"
              value={form.submissionDeadline}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-primary" onClick={handleSubmit} style={{width:'100%'}}>
            Send Data Request
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateDataRequest