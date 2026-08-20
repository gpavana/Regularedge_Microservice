import { useState, useEffect } from 'react'
import { addCertification, getMyDataRequests } from '../../services/api'

function AddCertification() {
  const [form, setForm] = useState({
    requestId: '',
    certifiedById: localStorage.getItem('userId') || '',
    certificationDate: new Date().toISOString().split('T')[0],
    certificationStatement: '',
    status: 'Certified'
  })
  const [requests, setRequests] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMyRequests()
  }, [])

  async function loadMyRequests() {
    const userId = localStorage.getItem('userId')
    if (!userId) return

    try {
      const res = await getMyDataRequests(userId)
      const readyRequests = res.data.filter(r => r.status === 'DATA_PROVIDED')
      setRequests(readyRequests)

      if (readyRequests.length > 0) {
        setForm(prev => ({ ...prev, requestId: readyRequests[0].requestId }))
      }
    } catch (err) {
      setMsg('error:Failed to load requests')
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!form.requestId || !form.certificationStatement) {
      setMsg('error:Please fill all required fields')
      return
    }

    setLoading(true)
    setMsg('')

    try {
      await addCertification({
        ...form,
        certifiedById: parseInt(form.certifiedById),
        requestId: parseInt(form.requestId)
      })
      setMsg('success:Certification added successfully!')
      setTimeout(() => {
        setForm({
          requestId: '',
          certifiedById: localStorage.getItem('userId') || '',
          certificationDate: new Date().toISOString().split('T')[0],
          certificationStatement: '',
          status: 'Certified'
        })
        loadMyRequests()
      }, 1500)
    } catch (err) {
      console.error(err)
      setMsg('error:Failed to add certification')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <nav>
        <h1>RegulareEdge</h1>
        <div>
          <a href="/dataowner/my-requests">My Data Requests</a>
          <a href="/dataowner/add-certification">Add Certification</a>
          <a href="/notifications">🔔 Notifications</a>  {/* ADD THIS */}

          <a href="/login">Logout</a>
        </div>
      </nav>

      <div className="page">
        <div className="card" style={{maxWidth:'700px',margin:'30px auto'}}>
          <h2>Add Data Certification</h2>
          <p style={{color:'#666',marginBottom:'16px'}}>Certify data that has been validated</p>

          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}

          <div className="form-group">
            <label>Select Request to Certify *</label>
            <select name="requestId" value={form.requestId} onChange={handleChange}>
              <option value="">-- Choose Request --</option>
              {requests.map(req => (
                <option key={req.requestId} value={req.requestId}>
                  Request #{req.requestId} - {req.dataDescription} (Status: {req.status})
                </option>
              ))}
            </select>
            {requests.length === 0 && (
              <p style={{fontSize:'12px',color:'#f57f17',marginTop:'5px'}}>
                No requests ready to certify. Upload your PDF and set the status to DATA_PROVIDED first.
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Your User ID</label>
            <input
              name="certifiedById"
              type="number"
              value={form.certifiedById}
              disabled
              style={{background:'#f5f5f5'}}
            />
          </div>

          <div className="form-group">
            <label>Certification Date</label>
            <input
              name="certificationDate"
              type="date"
              value={form.certificationDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Certification Statement *</label>
            <textarea
              name="certificationStatement"
              value={form.certificationStatement}
              onChange={handleChange}
              placeholder="I, [Your Name], [Designation], hereby certify that the data provided is accurate, complete, and extracted from our system as of [date]. Data has been cross-verified and validated."
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <input
              name="status"
              value={form.status}
              disabled
              style={{background:'#f5f5f5'}}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || requests.length === 0}
            style={{width:'100%'}}
          >
            {loading ? 'Adding Certification...' : 'Add Certification'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddCertification