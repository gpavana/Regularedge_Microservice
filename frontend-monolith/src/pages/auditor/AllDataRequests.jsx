import { useState, useEffect } from 'react'
import { downloadDataFile, getAllDataRequestsAdmin } from '../../services/api'

function AllDataRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    setLoading(true)
    try {
      const res = await getAllDataRequestsAdmin()
      setRequests(res.data)
    } catch (err) {
      console.error('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload(requestId) {
    try {
      const res = await downloadDataFile(requestId)
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', res.fileName || `submission_${requestId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error('Download failed')
      alert('Failed to download file')
    }
  }

  function getStatusBadge(status) {
    const colors = {
      'PENDING': 'badge-orange',
      'IN_PROGRESS': 'badge-blue',
      'COMPLETED': 'badge-green',
      'REJECTED': 'badge-red'
    }
    return <span className={`badge ${colors[status] || 'badge-gray'}`}>{status}</span>
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
        <div className="card">
          <h2>All Data Requests (Audit View)</h2>
          <p style={{color:'#666',fontSize:'14px',marginBottom:'20px'}}>
            View all data collection requests and download submitted files
          </p>

          {loading ? (
            <p style={{textAlign:'center',padding:'20px'}}>Loading...</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Calendar ID</th>
                    <th>Data Owner</th>
                    <th>Description</th>
                    <th>Cut-off Date</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr><td colSpan="8" style={{textAlign:'center',padding:'20px',color:'#888'}}>No data requests found</td></tr>
                  ) : requests.map(req => (
                    <tr key={req.requestId}>
                      <td>{req.requestId}</td>
                      <td>{req.calendarId}</td>
                      <td>{req.dataOwnerId}</td>
                      <td style={{maxWidth:'250px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                        {req.dataDescription}
                      </td>
                      <td>{req.dataCutOffDate || '-'}</td>
                      <td>{req.submissionDeadline || '-'}</td>
                      <td>{getStatusBadge(req.status)}</td>
                      <td>
                        {req.status === 'COMPLETED' && (
                          <button 
                            onClick={() => handleDownload(req.requestId)}
                            style={{
                              padding:'6px 12px',
                              fontSize:'12px',
                              backgroundColor:'#2196F3',
                              color:'white',
                              border:'none',
                              borderRadius:'4px',
                              cursor:'pointer'
                            }}
                          >
                            📥 Download
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllDataRequests