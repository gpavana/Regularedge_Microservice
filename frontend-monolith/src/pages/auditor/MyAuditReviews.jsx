import { useState, useEffect } from 'react'
import { getMyReviews, getReviewsByRating } from '../../services/api.js'

function MyAuditReviews() {
  const [reviews, setReviews] = useState([])
  const [filter, setFilter] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchMyReviews()
  }, [])

  async function fetchMyReviews() {
    setLoading(true)
    setMsg('')
    try {
      const res = await getMyReviews(userId)
      setReviews(res.data)
    } catch (err) {
      setMsg('error:Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  async function handleFilter() {
    if (!filter) {
      fetchMyReviews()
      return
    }
    setLoading(true)
    setMsg('')
    try {
      const res = await getReviewsByRating(filter)
      setReviews(res.data)
      if (res.data.length === 0) {
        setMsg('error:No reviews found for this rating')
      }
    } catch (err) {
      setMsg('error:Failed to filter')
    } finally {
      setLoading(false)
    }
  }

  function getRatingBadge(rating) {
    const colors = {
      'SATISFACTORY': 'badge-green',
      'NEEDS_IMPROVEMENT': 'badge-orange',
      'UNSATISFACTORY': 'badge-red'
    }
    return <span className={`badge ${colors[rating] || 'badge-gray'}`}>{rating}</span>
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
          <h2>My Audit Reviews</h2>
          <p style={{color:'#666',fontSize:'14px',marginBottom:'20px'}}>
            Logged in as Auditor ID: <strong>{userId}</strong>
          </p>

          <div style={{display:'flex',gap:'10px',marginBottom:'20px'}}>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{padding:'8px',borderRadius:'4px',border:'1px solid #ccc'}}
            >
              <option value="">All Ratings</option>
              <option value="SATISFACTORY">SATISFACTORY</option>
              <option value="NEEDS_IMPROVEMENT">NEEDS IMPROVEMENT</option>
              <option value="UNSATISFACTORY">UNSATISFACTORY</option>
            </select>
            <button className="btn btn-primary" onClick={handleFilter}>Filter</button>
            <button className="btn btn-secondary" onClick={fetchMyReviews}>Reset</button>
          </div>

          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'} style={{marginBottom:'16px'}}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Review ID</th>
                  <th>Obligation ID</th>
                  <th>Period</th>
                  <th>Rating</th>
                  <th>Findings</th>
                  <th>Review Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{textAlign:'center',padding:'20px'}}>Loading...</td></tr>
                ) : reviews.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign:'center',padding:'20px',color:'#888'}}>
                    No reviews found. Add a review first!
                  </td></tr>
                ) : reviews.map(review => (
                  <tr key={review.reviewId}>
                    <td>{review.reviewId}</td>
                    <td>{review.obligationId}</td>
                    <td>{review.reviewPeriod || '-'}</td>
                    <td>{getRatingBadge(review.rating)}</td>
                    <td style={{maxWidth:'300px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {review.findingsSummary || '-'}
                    </td>
                    <td>{review.reviewDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyAuditReviews