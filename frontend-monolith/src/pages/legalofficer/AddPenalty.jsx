import { useState, useEffect } from 'react'
import { addPenalty, getOverdueDeadlines } from '../../services/api'

function AddPenalty() {
  const [form, setForm] = useState({
    correspondenceId: Math.floor(Math.random() * 1000000),
    obligationId: 0,
    penaltyType: '',
    penaltyAmount: '',
    paidDate: '',
    disputeStatus: 'Not Disputed',
    status: 'OPEN'
  })
  const [overdueDeadlines, setOverdueDeadlines] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOverdueDeadlines()
  }, [])

  async function fetchOverdueDeadlines() {
    try {
      const res = await getOverdueDeadlines()
      setOverdueDeadlines(res.data)
    } catch (err) {
      console.error('Failed to load overdue deadlines')
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function selectOverdue(calendar) {
    const penaltyType = `Late Submission - Obligation ID ${calendar.obligationId} (Due: ${calendar.dueDate})`
    setForm({ 
      ...form, 
      obligationId: calendar.obligationId,
      penaltyType,
      penaltyAmount: '500000'
    })
    setMsg('info:Penalty details filled from overdue deadline. Adjust amount if needed.')
  }


  async function handleSubmit() {
    if (!form.penaltyType || !form.penaltyAmount) {
      setMsg('error:Please fill required fields')
      return
    }

    setLoading(true)
    setMsg('')

    try {
      await addPenalty({
        ...form,
        correspondenceId: parseInt(form.correspondenceId),
        obligationId: parseInt(form.obligationId),
        penaltyAmount: parseFloat(form.penaltyAmount)
      })
      setMsg('success:Penalty added successfully!')
      setTimeout(() => {
        setForm({
          correspondenceId: Math.floor(Math.random() * 1000000),
          obligationId: 0,
          penaltyType: '',
          penaltyAmount: '',
          paidDate: '',
          disputeStatus: 'Not Disputed',
          status: 'OPEN'
        })
        setMsg('')
        fetchOverdueDeadlines()
      }, 1500)
    } catch (err) {
      console.error(err)
      setMsg('error:Failed to add penalty')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <nav>
        <h1>RegulareEdge</h1>
        <div>
          <a href="/legal/add-penalty">Add Penalty</a>
          <a href="/legal/all-penalties">All Penalties</a>
          <a href="/login">Logout</a>
        </div>
      </nav>

      <div className="page">
        <div className="card" style={{maxWidth:'700px',margin:'30px auto'}}>
          <h2>Add Penalty Proceeding</h2>
          <p style={{color:'#666',fontSize:'14px',marginBottom:'16px'}}>
            Correspondence ID: <strong>{form.correspondenceId}</strong> (auto-generated)
          </p>

          {msg && <div className={
            msg.startsWith('error') ? 'msg-error' : 
            msg.startsWith('info') ? 'msg-info' : 'msg-success'
          } style={{marginBottom:'16px'}}>
            {msg.replace('error:', '').replace('success:', '').replace('info:', '')}
          </div>}

          {overdueDeadlines.length > 0 && (
            <div style={{background:'#ffebee',padding:'16px',borderRadius:'8px',marginBottom:'24px',border:'1px solid #ffcdd2'}}>
              <h3 style={{fontSize:'16px',color:'#c62828',marginBottom:'12px'}}>⚠️ Overdue Deadlines ({overdueDeadlines.length})</h3>
              <p style={{fontSize:'13px',color:'#666',marginBottom:'12px'}}>Click a deadline to auto-fill the penalty details below</p>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {overdueDeadlines.map(cal => (
                  <div 
                    key={cal.calendarId}
                    style={{
                      background:'white',
                      padding:'12px',
                      borderRadius:'6px',
                      border:'1px solid #ffcdd2',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      onClick={() => selectOverdue(cal)}
                      style={{
                        flex: 1,
                        cursor:'pointer',
                        transition:'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fff9f0'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{fontWeight:'600',color:'#c62828'}}>Obligation ID: {cal.obligationId}</div>
                      <div style={{fontSize:'13px',color:'#666',marginTop:'4px'}}>
                        Due: {cal.dueDate} | {Math.floor((new Date() - new Date(cal.dueDate)) / (1000 * 60 * 60 * 24))} days late
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Penalty Type *</label>
            <input
              name="penaltyType"
              value={form.penaltyType}
              onChange={handleChange}
              placeholder="e.g., Late Submission - Monthly Loan Report May 2026"
            />
          </div>

          <div className="form-group">
            <label>Penalty Amount (₹) *</label>
            <input
              name="penaltyAmount"
              type="number"
              value={form.penaltyAmount}
              onChange={handleChange}
              placeholder="500000"
            />
            <p style={{fontSize:'12px',color:'#888',marginTop:'4px'}}>Enter amount in rupees (e.g., 500000 for ₹5 lakhs)</p>
          </div>

          <div className="form-group">
            <label>Paid Date</label>
            <input
              name="paidDate"
              type="date"
              value={form.paidDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Dispute Status</label>
            <select name="disputeStatus" value={form.disputeStatus} onChange={handleChange}>
              <option value="Not Disputed">Not Disputed</option>
              <option value="Disputed">Disputed</option>
              <option value="Appeal Filed">Appeal Filed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="OPEN">OPEN</option>
              <option value="PAID">PAID</option>
              <option value="APPEALING">APPEALING</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{width:'100%'}}
          >
            {loading ? 'Adding Penalty...' : 'Add Penalty'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddPenalty