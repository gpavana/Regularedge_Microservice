import { useState, useEffect } from 'react'
import { createReturn, getActiveObligations, getUpcomingDeadlines, uploadReturnDocument } from '../../services/api.js'

function CreateReturn() {
  const [form, setForm] = useState({
    obligationId: '',
    calendarId: '',
    reportingPeriod: '',
    preparedById: localStorage.getItem('userId') || '',
    totalSchedules: '1',
    submissionDeadline: '',
    status: 'DRAFT'
  })

  const [obligations, setObligations] = useState([])
  const [deadlines, setDeadlines] = useState([])
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadObligations()
    loadDeadlines()
  }, [])

  async function loadObligations() {
    try {
      const res = await getActiveObligations()
      setObligations(res.data)
    } catch (err) {
      console.error('Failed to load obligations')
    }
  }

  async function loadDeadlines() {
    try {
      const res = await getUpcomingDeadlines()
      setDeadlines(res.data)
    } catch (err) {
      console.error('Failed to load deadlines')
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // When obligation is selected, auto-fill total schedules
  function handleObligationChange(e) {
    const selectedId = e.target.value
    setForm({ ...form, obligationId: selectedId })
  }

  // When calendar is selected, auto-fill deadline
  function handleCalendarChange(e) {
    const selectedId = e.target.value
    const selected = deadlines.find(d => d.calendarId === parseInt(selectedId))
    
    setForm({
      ...form,
      calendarId: selectedId,
      submissionDeadline: selected ? selected.dueDate : ''
    })
  }

  async function handleSubmit() {
    if (!form.obligationId || !form.calendarId || !form.reportingPeriod) {
      setMsg('error:Please fill all required fields!')
      return
    }

    setLoading(true)
    setMsg('')

    try {
      const res = await createReturn(form)
      if (res.status === 201 || res.status === 200) {
        // If the CO attached a PDF, upload it to the newly created return so the CCO can review it.
        if (file) {
          try {
            await uploadReturnDocument(res.data.returnId, file)
          } catch (uErr) {
            const reason = uErr.response?.data?.message || uErr.response?.data
            setMsg('error:Return created, but PDF upload failed: ' + (reason || 'unknown error'))
            setLoading(false)
            return
          }
        }
        setMsg('success:Return created successfully!' + (file ? ' PDF attached.' : ''))
        // Reset form
        setForm({
          obligationId: '',
          calendarId: '',
          reportingPeriod: '',
          preparedById: localStorage.getItem('userId') || '',
          totalSchedules: '1',
          submissionDeadline: '',
          status: 'DRAFT'
        })
        setFile(null)
      }
    } catch (err) {
      console.error(err)
      setMsg('error:Failed to create return.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <nav>
        <h1>RegulareEdge</h1>
        <div>
          <a href="/co/create-return">Create Return</a>
          <a href="/co/my-returns">My Returns</a>
          <a href="/co/returns-by-status">Filter Returns</a>
          <a href="/co/calendar">Calendar</a>
          <a href="/co/create-data-request">Request Data</a>
          <a href="/co/view-data-requests">Data Status</a>        <a href="/notifications">🔔 Notifications</a>  {/* ADD THIS */}

          <a href="/login">Logout</a>
        </div>
      </nav>

      <div className="page">
        <div className="card" style={{ maxWidth: '600px', margin: '30px auto' }}>
          <h2>Create New Return</h2>

          {/* SELECT OBLIGATION (DROPDOWN) */}
          <div className="form-group">
            <label>Select Obligation *</label>
            <select 
              name="obligationId" 
              value={form.obligationId} 
              onChange={handleObligationChange}
            >
              <option value="">-- Choose Obligation --</option>
              {obligations.map(o => (
                <option key={o.obligationId} value={o.obligationId}>
                  {o.returnName} ({o.returnCode}) - {o.frequency}
                </option>
              ))}
            </select>
          </div>

          {/* SELECT CALENDAR DEADLINE (DROPDOWN) */}
          <div className="form-group">
            <label>Select Deadline *</label>
            <select 
              name="calendarId" 
              value={form.calendarId} 
              onChange={handleCalendarChange}
            >
              <option value="">-- Choose Deadline --</option>
              {deadlines.map(d => (
                <option key={d.calendarId} value={d.calendarId}>
                  Due: {d.dueDate} (Cut-off: {d.dataCutOffDate})
                </option>
              ))}
            </select>
          </div>

          {/* REPORTING PERIOD */}
          <div className="form-group">
            <label>Reporting Period *</label>
            <input 
              name="reportingPeriod" 
              placeholder="e.g. May 2025" 
              value={form.reportingPeriod} 
              onChange={handleChange}
            />
            <small style={{ color: '#666' }}>Example: May 2025, Q1 2025, FY 2024-25</small>
          </div>

          {/* TOTAL SCHEDULES */}
          <div className="form-group">
            <label>Total Schedules</label>
            <input 
              name="totalSchedules" 
              type="number" 
              value={form.totalSchedules} 
              onChange={handleChange}
            />
            <small style={{ color: '#666' }}>How many sections in the report</small>
          </div>

          {/* AUTO-FILLED DEADLINE */}
          <div className="form-group">
            <label>Submission Deadline (auto-filled)</label>
            <input 
              name="submissionDeadline" 
              type="date" 
              value={form.submissionDeadline} 
              onChange={handleChange}
              readOnly
              style={{ background: '#f0f0f0' }}
            />
          </div>

          {/* INITIAL STATUS */}
          <div className="form-group">
            <label>Initial Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="DRAFT">DRAFT</option>
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
            </select>
          </div>

          {/* ATTACH RETURN DOCUMENT (PDF) FOR CCO REVIEW */}
          <div className="form-group">
            <label>Attach Return Document (PDF)</label>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
            <small style={{ color: '#666' }}>PDF only — the CCO reviews this before approving the return.</small>
          </div>

          {/* PREPARED BY (HIDDEN - AUTO FROM LOGIN) */}
          <input type="hidden" name="preparedById" value={form.preparedById} />

          {/* SUBMIT BUTTON */}
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '12px' }}
          >
            {loading ? 'Creating...' : 'Create Return'}
          </button>

          {msg && (
            <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'} style={{ marginTop: '14px' }}>
              {msg.replace('error:', '').replace('success:', '')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateReturn