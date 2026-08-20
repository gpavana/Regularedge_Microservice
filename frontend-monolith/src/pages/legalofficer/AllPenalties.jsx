import { useState, useEffect } from 'react'
import { getAllPenalties, getPenaltiesByStatus, updatePenaltyStatus } from '../../services/api.js'

function AllPenalties() {
  const [penalties, setPenalties] = useState([])
  const [filter, setFilter]       = useState('')
  const [msg, setMsg]             = useState('')
  const [loading, setLoading]     = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  const [selectedPenalty, setSelectedPenalty] = useState(null)
  const [paidDate, setPaidDate] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true); setMsg('')
    try {
      const res = await getAllPenalties()
      setPenalties(res.data)
      setRefreshKey(prev => prev + 1)
    } catch (err) { setMsg('error:Failed to load penalties.') }
    finally { setLoading(false) }
  }

  async function fetchByStatus() {
    if (!filter) { fetchAll(); return }
    setLoading(true); setMsg('')
    try {
      const res = await getPenaltiesByStatus(filter)
      setPenalties(res.data)
      setRefreshKey(prev => prev + 1)
      if (res.data.length === 0) setMsg('error:No penalties found for this status.')
    } catch (err) { setMsg('error:Failed to filter.') }
    finally { setLoading(false) }
  }

  function handleStatusChange(penaltyId, currentStatus, newStatus) {
    if (!newStatus) return
    
    // Prevent changing if already PAID or CLOSED
    if (currentStatus === 'PAID' || currentStatus === 'CLOSED') {
      setMsg('error:Cannot change status of PAID or CLOSED penalties!')
      return
    }
    
    // If status is PAID, show date picker modal
    if (newStatus === 'PAID') {
      setSelectedPenalty({ penaltyId, status: newStatus })
      setPaidDate(new Date().toISOString().split('T')[0])
      setShowDateModal(true)
    } else {
      // For other statuses, update directly
      updateStatus(penaltyId, newStatus, null)
    }
  }

  async function updateStatus(penaltyId, status, paidDate) {
    try {
      const payload = { penaltyId, status }
      if (paidDate) payload.paidDate = paidDate
      
      await updatePenaltyStatus(payload)
      setMsg('success:Status updated successfully!')
      setShowDateModal(false)
      setSelectedPenalty(null)
      setPaidDate('')
      fetchAll()
    } catch (err) { 
      console.error('Update error:', err)
      setMsg('error:Update failed. ' + (err.response?.data || '')) 
    }
  }

  function handleConfirmPaidDate() {
    if (!paidDate) {
      setMsg('error:Please select a paid date')
      return
    }
    updateStatus(selectedPenalty.penaltyId, selectedPenalty.status, paidDate)
  }

  function handleCancelModal() {
    setShowDateModal(false)
    setSelectedPenalty(null)
    setPaidDate('')
    setMsg('')
  }

  function getStatusBadge(status) {
    const map = { 
      OPEN: 'badge-red', 
      PAID: 'badge-green', 
      APPEALING: 'badge-orange', 
      CLOSED: 'badge-gray',
      UNDER_REVIEW: 'badge-orange',
      RESOLVED: 'badge-green'
    }
    return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>
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
        <div className="card">
          <h2>All Penalties</h2>
          <div className="filter-row">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="OPEN">OPEN</option>
              <option value="PAID">PAID</option>
              <option value="APPEALING">APPEALING</option>
              <option value="CLOSED">CLOSED</option>
            </select>
            <button className="btn btn-primary" onClick={fetchByStatus}>Filter</button>
            <button className="btn btn-secondary" onClick={fetchAll}>Show All</button>
          </div>
          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'} style={{ marginBottom: '14px' }}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Type</th><th>Amount (₹)</th><th>Dispute</th><th>Paid Date</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
                ) : penalties.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No penalties found</td></tr>
                ) : penalties.map((p) => (
                  <tr key={p.penaltyId}>
                    <td>{p.penaltyId}</td>
                    <td>{p.penaltyType || '-'}</td>
                    <td>₹ {p.penaltyAmount?.toLocaleString('en-IN') || '0'}</td>
                    <td>{p.disputeStatus || 'NO'}</td>
                    <td>{p.paidDate || '-'}</td>
                    <td>{getStatusBadge(p.status)}</td>
                    <td>
                      {p.status === 'PAID' || p.status === 'CLOSED' ? (
                        <span style={{ 
                          padding: '5px 10px', 
                          color: '#999', 
                          fontSize: '13px',
                          fontStyle: 'italic'
                        }}>
                          Locked 🔒
                        </span>
                      ) : (
                        <select 
                          key={`${p.penaltyId}-${refreshKey}`}
                          onChange={(e) => handleStatusChange(p.penaltyId, p.status, e.target.value)}
                          style={{ 
                            padding: '5px', 
                            borderRadius: '4px', 
                            border: '1px solid #ccc', 
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                          defaultValue=""
                        >
                          <option value="">-- Change --</option>
                          <option value="OPEN">OPEN</option>
                          <option value="PAID">PAID</option>
                          <option value="APPEALING">APPEALING</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            minWidth: '400px'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Enter Paid Date</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                Paid Date *
              </label>
              <input
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '14px'
                }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>Select the date when payment was made</small>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancelModal}
                style={{
                  padding: '10px 20px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPaidDate}
                style={{
                  padding: '10px 20px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllPenalties