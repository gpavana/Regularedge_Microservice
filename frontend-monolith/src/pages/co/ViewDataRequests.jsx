import { useState, useEffect } from 'react'
import { getRequestsCreatedByCO, downloadDataFile } from '../../services/api'

function ViewDataRequests() {
  const [requests, setRequests] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    const userId = localStorage.getItem('userId')
    try {
      // CO views requests they created
      const res = await getRequestsCreatedByCO(userId)

      setRequests(res.data)
    } catch (err) {
      setMsg('error:Failed to load')
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
      setMsg('success:Downloaded!')
    } catch (err) {
      setMsg('error:No file uploaded yet')
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
          <a href="/co/create-data-request">Request Data</a>
          <a href="/co/view-data-requests">Data Status</a>        <a href="/notifications">🔔 Notifications</a>  {/* ADD THIS */}

          <a href="/login">Logout</a>
        </div>
      </nav>

      <div className="page">
        <div className="card">
          <h2>My Data Requests - Status</h2>

          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Cut-off</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign:'center',padding:'20px'}}>No data requests yet</td></tr>
              ) : requests.map(req => (
                <tr key={req.requestId}>
                  <td>{req.requestId}</td>
                  <td>{req.dataDescription}</td>
                  <td>{req.dataCutOffDate}</td>
                  <td>{req.submissionDeadline}</td>
                  <td>
                    <span className={`badge ${
                      req.status === 'CERTIFIED' ? 'badge-green' :
                      req.status === 'DATA_PROVIDED' ? 'badge-orange' : 'badge-red'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === 'CERTIFIED' || req.status === 'DATA_PROVIDED' ? (
                      <button className="btn btn-primary" onClick={() => handleDownload(req.requestId)} style={{padding:'5px 10px',fontSize:'12px'}}>
                        Download
                      </button>
                    ) : (
                      <span style={{fontSize:'12px',color:'#999'}}>Waiting...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ViewDataRequests