import { useState, useEffect } from 'react'
import { addAuditReview, getActiveObligations } from '../../services/api.js'

function AddAuditReview() {
  const [form, setForm] = useState({
    obligationId: '',
    auditorId: localStorage.getItem('userId') || '',
    reviewPeriod: '',
    scope: '',
    findingsSummary: '',
    rating: 'SATISFACTORY',
    reviewDate: new Date().toISOString().split('T')[0],
    status: 'Planned'
  })
  const [obligations, setObligations] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadObligations()
  }, [])

  async function loadObligations() {
    try {
      const res = await getActiveObligations()
      setObligations(res.data)
    } catch (err) {
      console.error('Failed to load obligations:', err)
      setMsg('error:Failed to load obligations. Make sure backend is running.')
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!form.obligationId || !form.auditorId || !form.scope) {
      setMsg('error:Please fill all required fields!')
      return
    }

    setLoading(true)
    setMsg('')

    try {
      const res = await addAuditReview(form)
      if (res.status === 201 || res.status === 200) {
        setMsg('success:Audit review added successfully!')
        setForm({
          obligationId: '',
          auditorId: localStorage.getItem('userId') || '',
          reviewPeriod: '',
          scope: '',
          findingsSummary: '',
          rating: 'SATISFACTORY',
          reviewDate: new Date().toISOString().split('T')[0],
          status: 'Planned'
        })
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setMsg('error:Review already exists!')
      } else {
        setMsg('error:Something went wrong.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <nav>
        <h1>🛡️ RegulareEdge</h1>
        <div>
          <a href="/auditor/add-review">Add Review</a>
          <a href="/auditor/my-reviews">My Reviews</a>
          <a href="/auditor/all-returns">All Returns</a>
          <a href="/auditor/all-penalties">All Penalties</a>
          <a href="/auditor/all-data-requests">Data Requests</a>
          <a href="/auditor/all-obligations">All Obligations</a>
          <a href="/login">Logout</a>
        </div>
      </nav>
      <div className="page">
        <div className="card" style={{ maxWidth: '600px', margin: '30px auto' }}>
          <h2>Add Audit Review</h2>

          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'} style={{marginBottom:'16px'}}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}

          <div className="form-group">
            <label>Obligation ID *</label>
            <select name="obligationId" value={form.obligationId} onChange={handleChange}>
              <option value="">-- Select Obligation --</option>
              {obligations.map(obl => (
                <option key={obl.obligationId} value={obl.obligationId}>
                  ID: {obl.obligationId} - {obl.returnName} ({obl.returnCode})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Your User ID * (Auto-filled)</label>
            <input 
              name="auditorId" 
              type="number" 
              value={form.auditorId} 
              readOnly
              style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}
            />
            <small style={{color:'#666',fontSize:'12px'}}>Automatically set from your login</small>
          </div>

          <div className="form-group">
            <label>Review Period</label>
            <input 
              name="reviewPeriod" 
              placeholder="e.g., Q1 2025, May 2025" 
              value={form.reviewPeriod} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Scope *</label>
            <textarea
              name="scope" 
              placeholder="What was reviewed (e.g., Data accuracy, process compliance, control effectiveness)" 
              value={form.scope} 
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Findings Summary</label>
            <textarea
              name="findingsSummary" 
              placeholder="Key findings and observations" 
              value={form.findingsSummary} 
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Review Date * (Auto-filled to today)</label>
            <input 
              name="reviewDate" 
              type="date" 
              value={form.reviewDate} 
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            <small style={{color:'#666',fontSize:'12px'}}>Default: Today's date (you can change if needed)</small>
          </div>

          <div className="form-group">
            <label>Rating *</label>
            <select name="rating" value={form.rating} onChange={handleChange}>
              <option value="SATISFACTORY">✅ SATISFACTORY</option>
              <option value="NEEDS_IMPROVEMENT">⚠️ NEEDS IMPROVEMENT</option>
              <option value="UNSATISFACTORY">❌ UNSATISFACTORY</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Reported">Reported</option>
            </select>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleSubmit} 
            disabled={loading}
            style={{width:'100%'}}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddAuditReview