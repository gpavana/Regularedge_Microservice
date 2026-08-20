import { useState, useEffect } from 'react'
import { getMyDataRequests, updateDataRequestStatus, uploadDataFile } from '../../services/api'

function MyDataRequests() {
  const [requests, setRequests] = useState([])
  const [dataOwnerId] = useState(localStorage.getItem('userId') || '')
  const [msg, setMsg] = useState('')
  const [selectedFiles, setSelectedFiles] = useState({})
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (dataOwnerId) {
      fetchRequests()
    }
  }, [dataOwnerId])

  async function fetchRequests() {
    try {
      const res = await getMyDataRequests(dataOwnerId)
      setRequests(res.data)
    } catch (err) {
      setMsg('error:Failed to load requests')
    }
  }

  function handleFileSelect(requestId, file) {
    setSelectedFiles({ ...selectedFiles, [requestId]: file })
  }

  async function handleUpload(requestId) {
    const file = selectedFiles[requestId]
    
    if (!file) {
      setMsg('error:Please select a file first!')
      return
    }

    setUploading(true)
    setMsg('')

    try {
      await uploadDataFile(file, requestId)
      setMsg(`success:File "${file.name}" uploaded successfully!`)
      fetchRequests()
      setSelectedFiles({ ...selectedFiles, [requestId]: null })
    } catch (err) {
      const reason = err.response?.data?.message || err.response?.data
      setMsg('error:' + (reason || 'File upload failed'))
    } finally {
      setUploading(false)
    }
  }

  async function handleStatusChange(requestId, status) {
    try {
      await updateDataRequestStatus({ requestId, status })
      setMsg(`success:Status updated to ${status}!`)
      fetchRequests()
    } catch (err) {
      setMsg('error:Failed to update')
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
        <div className="card">
          <h2>My Data Requests</h2>
          <p style={{color:'#666',marginBottom:'16px'}}>Logged in as User ID: {dataOwnerId}</p>

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
                <th>Upload File</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign:'center',padding:'20px',color:'#888'}}>No requests found. CO will send requests to you.</td></tr>
              ) : requests.map((req) => (
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
                    {(req.status === 'SENT' || req.status === 'DATA_PROVIDED') ? (
                      <div style={{display:'flex',gap:'5px',flexDirection:'column'}}>
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          onChange={(e) => handleFileSelect(req.requestId, e.target.files[0])}
                          style={{fontSize:'12px'}}
                        />
                        <small style={{color:'#888',fontSize:'11px'}}>PDF only — pick file, then click Upload and wait for the success message</small>
                        {selectedFiles[req.requestId] && (
                          <button
                            className="btn btn-success"
                            onClick={() => handleUpload(req.requestId)}
                            disabled={uploading}
                            style={{padding:'5px 10px',fontSize:'12px'}}
                          >
                            {uploading ? 'Uploading...' : 'Upload'}
                          </button>
                        )}
                      </div>
                    ) : (
                      <span style={{color:'#666',fontSize:'12px'}}>✅ Uploaded</span>
                    )}
                  </td>
                  <td>
                    <select
                      value={req.status}
                      onChange={(e) => handleStatusChange(req.requestId, e.target.value)}
                      style={{padding:'5px',borderRadius:'4px',border:'1px solid #ddd',fontSize:'12px'}}
                    >
                      <option value="SENT">SENT</option>
                      <option value="DATA_PROVIDED">DATA_PROVIDED</option>
                      <option value="CERTIFIED">CERTIFIED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
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

export default MyDataRequests