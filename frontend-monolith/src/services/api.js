import axios from 'axios'
const BASE_URL = 'http://localhost:9080'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
}
  return config
})
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const ROLE_LONG_TO_SHORT = {
  ADMIN: 'ADMIN', CCO: 'CCO', DATA_OWNER: 'DATA_OWNER',
  COMPLIANCE_OFFICER: 'CO', LEGAL_OFFICER: 'LEGAL', INTERNAL_AUDITOR: 'AUDITOR'
}
const ROLE_SHORT_TO_LONG = {
  ADMIN: 'ADMIN', CCO: 'CCO', DATA_OWNER: 'DATA_OWNER',
  CO: 'COMPLIANCE_OFFICER', LEGAL: 'LEGAL_OFFICER', AUDITOR: 'INTERNAL_AUDITOR'
}
const toShortRole = (r) => ROLE_LONG_TO_SHORT[r] || r
const toLongRole = (r) => ROLE_SHORT_TO_LONG[r] || r


const DATA_REQUEST_STATUS_OUT = { SENT: 'PENDING', DATA_PROVIDED: 'IN_PROGRESS', CERTIFIED: 'COMPLETED', REJECTED: 'OVERDUE' }
const DATA_REQUEST_STATUS_IN = { PENDING: 'SENT', IN_PROGRESS: 'DATA_PROVIDED', COMPLETED: 'CERTIFIED', OVERDUE: 'REJECTED' }

const RETURN_STATUS_OUT = { DRAFT: 'DRAFT', UNDER_REVIEW: 'IN_PROGRESS', PENDING_CCO_APPROVAL: 'PENDING_CCO_APPROVAL', SUBMITTED: 'SUBMITTED', ACKNOWLEDGED: 'APPROVED', LATE: 'REJECTED' }
const RETURN_STATUS_IN = { DRAFT: 'DRAFT', IN_PROGRESS: 'UNDER_REVIEW', PENDING_CCO_APPROVAL: 'PENDING_CCO_APPROVAL', SUBMITTED: 'SUBMITTED', APPROVED: 'ACKNOWLEDGED', REJECTED: 'LATE' }

const PENALTY_STATUS_OUT = { OPEN: 'OPEN', PAID: 'PAID', APPEALING: 'DISPUTED', CLOSED: 'WAIVED' }
const PENALTY_STATUS_IN = { OPEN: 'OPEN', PAID: 'PAID', DISPUTED: 'APPEALING', WAIVED: 'CLOSED' }

const FREQUENCY_OUT = { ANNUAL: 'ANNUALLY' }

const mapOut = (table, value) => table[value] || value
const mapIn = (table, value) => table[value] || value

const stripStatus = ({ status, ...rest }) => rest
const translateReturn = (r) => r && { ...r, status: mapIn(RETURN_STATUS_IN, r.status) }
const translateRequest = (r) => r && { ...r, status: mapIn(DATA_REQUEST_STATUS_IN, r.status) }
const translatePenalty = (p) => p && { ...p, status: mapIn(PENALTY_STATUS_IN, p.status) }
const translateUser = (u) => u && { ...u, role: toLongRole(u.role) }


let usersCache = []

export const getPendingReturns = async () => {
  const res = await api.get('/returns/pendingApprovals')
  return { ...res, data: (res.data || []).map(translateReturn) }
}


export const loginUser = async (data) => {
  const res = await api.post('/auth/login', data)
  let profile = {}
  try {
    const me = await axios.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${res.data.accessToken}` }
    })
    profile = me.data
  } catch {
    
  }
  return {
    ...res,
    data: {
      ...res.data,
      token: res.data.accessToken,
      role: toLongRole(res.data.role),
      userId: profile.userId,
      name: profile.name
    }
  }
}
export const addUser = (data) => api.post('/auth/register', { ...data, role: toShortRole(data.role) })
export const registerUser = addUser

export const getAllUsers = async () => {
  const res = await api.get('/users', { params: { size: 500 } })
  const list = (res.data.content || []).map(translateUser)
  usersCache = list
  return { ...res, data: list }
}
export const getUsersByRole = async (role) => {
  const res = await api.get(`/users/role/${toShortRole(role)}`, { params: { size: 500 } })
  const list = (res.data.content || []).map(translateUser)
  usersCache = [...usersCache.filter((u) => !list.some((x) => x.userId === u.userId)), ...list]
  return { ...res, data: list }
}
export const updateUserStatus = (data) => {
  const email = data.email || usersCache.find((u) => u.userId === Number(data.userId))?.email
  return api.put('/users/status', { email, status: data.status })
}
export const deleteUser = (data) => api.delete('/users', { data })

// NOTIFICATIONS
export const getMyNotifications = async (userId) => {
  const res = await api.get(`/notifications/my/${userId}`, { params: { size: 200 } })
  return { ...res, data: res.data.content || [] }
}
export const getUnreadNotifications = (userId) => api.get(`/notifications/unread/${userId}`)
export const getUnreadCount = (userId) => api.get(`/notifications/count/${userId}`)
export const markNotificationRead = (notificationId) => api.put(`/notifications/markRead/${notificationId}`)
export const markAllNotificationsRead = (userId) => api.put(`/notifications/markAllRead/${userId}`)

export const getAllAudits = () => api.get('/audit-reviews/getAll')

// CO
export const createReturn = (data) => api.post('/returns/create', {
  ...stripStatus(data),
  obligationId: Number(data.obligationId),
  calendarId: Number(data.calendarId),
  preparedById: Number(data.preparedById),
  totalSchedules: Number(data.totalSchedules) || 0
})
export const getMyReturns = async (userId) => {
  const res = await api.get(`/returns/myReturns/${userId}`)
  return { ...res, data: (res.data || []).map(translateReturn) }
}
export const getReturnsByStatus = async (status) => {
  const res = await api.get('/returns/getByStatus', { params: { status: mapOut(RETURN_STATUS_OUT, status) } })
  return { ...res, data: (res.data || []).map(translateReturn) }
}
export const updateReturnStatus = (data) => api.put('/returns/updateStatus', {
  returnId: Number(data.returnId),
  status: mapOut(RETURN_STATUS_OUT, data.status)
})

// AUDITOR
export const addAuditReview = (data) => api.post('/audit-reviews/add', {
  obligationId: Number(data.obligationId),
  auditorId: Number(data.auditorId),
  reviewPeriod: data.reviewPeriod,
  scope: data.scope,
  findingsSummary: data.findingsSummary,
  rating: data.rating,
  reviewDate: data.reviewDate
})
export const getMyReviews = (id) => api.get(`/audit-reviews/myReviews/${id}`)
export const getReviewsByRating = (rating) => api.get('/audit-reviews/getByRating', { params: { rating } })

// LEGAL
export const addPenalty = async (data) => {
  let correspondenceId = Number(data.correspondenceId)
 
  try {
    const obligationsRes = await api.get('/obligations/getActive')
    const obligation = (obligationsRes.data || []).find((o) => o.obligationId === Number(data.obligationId))
    if (obligation?.regulatorId) {
      const corr = await api.post('/correspondence/create', {
        regulatorId: obligation.regulatorId,
        type: 'NOTICE',
        receivedDate: new Date().toISOString().split('T')[0],
        subject: data.penaltyType || 'Penalty proceeding',
        assignedToId: Number(localStorage.getItem('userId'))
      })
      correspondenceId = corr.data.correspondenceId
    }
  } catch {
    // fall back to the client-generated id if correspondence auto-creation fails
  }

  return api.post('/penalties/add', {
    correspondenceId,
    obligationId: Number(data.obligationId),
    penaltyType: data.penaltyType,
    penaltyAmount: Number(data.penaltyAmount),
    disputeStatus: data.disputeStatus
  })
}
export const getAllPenalties = async () => {
  const res = await api.get('/penalties/getAll')
  return { ...res, data: (res.data || []).map(translatePenalty) }
}
export const getPenaltiesByStatus = async (status) => {
  const res = await api.get('/penalties/getByStatus', { params: { status: mapOut(PENALTY_STATUS_OUT, status) } })
  return { ...res, data: (res.data || []).map(translatePenalty) }
}
export const updatePenaltyStatus = (data) => api.put('/penalties/updateStatus', {
  penaltyId: Number(data.penaltyId),
  status: mapOut(PENALTY_STATUS_OUT, data.status),
  ...(data.paidDate ? { paidDate: data.paidDate } : {})
})

// ADMIN
export const addRegulator = (data) => api.post('/regulators/add', stripStatus(data))
export const getAllRegulators = () => api.get('/regulators/getAll')
export const getActiveRegulators = () => api.get('/regulators/getActive')
export const deleteRegulator = (data) => api.delete('/regulators/delete', { data })

// OBLIGATION
export const addObligation = (data) => api.post('/obligations/add', {
  ...stripStatus(data),
  regulatorId: Number(data.regulatorId),
  ownerId: Number(data.ownerId),
  frequency: mapOut(FREQUENCY_OUT, data.frequency)
})
export const getAllObligations = () => api.get('/obligations/getAll')
export const getActiveObligations = () => api.get('/obligations/getActive')
export const getObligationsByRegulator = (id) => api.get(`/obligations/byRegulator/${id}`)
export const getMyObligations = (id) => api.get(`/obligations/myObligations/${id}`)
export const updateObligationStatus = (data) => api.put('/obligations/updateStatus', data)

// CALENDAR
export const addDeadline = (data) => api.post('/calendar/add', {
  ...stripStatus(data),
  obligationId: Number(data.obligationId),
  reminderDays: Number(data.reminderDays) || 0
})
export const getUpcomingDeadlines = () => api.get('/calendar/upcoming')
export const getOverdueDeadlines = () => api.get('/calendar/overdue')
export const getDeadlinesByObligation = (id) => api.get(`/calendar/byObligation/${id}`)
export const updateCalendarStatus = (data) => api.put('/calendar/updateStatus', {
  calendarId: Number(data.calendarId),
  status: data.status
})

export const createDataRequest = (data) => api.post('/data-requests/create', {
  ...stripStatus(data),
  calendarId: Number(data.calendarId),
  dataOwnerId: Number(data.dataOwnerId)
})
export const getMyDataRequests = async (id) => {
  const res = await api.get(`/data-requests/myRequests/${id}`)
  return { ...res, data: (res.data || []).map(translateRequest) }
}
export const updateDataRequestStatus = (data) => api.put('/data-requests/updateStatus', {
  requestId: Number(data.requestId),
  status: mapOut(DATA_REQUEST_STATUS_OUT, data.status)
})
export const addCertification = (data) => api.post('/certifications/add', stripStatus({
  ...data,
  requestId: Number(data.requestId),
  certifiedById: Number(data.certifiedById)
}))


export const getRequestsCreatedByCO = async (coId) => {
  const res = await api.get('/data-requests/getAll')
  return { ...res, data: (res.data || []).map(translateRequest) }
}

export const uploadDataFile = (file, requestId) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('uploadedById', localStorage.getItem('userId') || '')
  return api.post(`/data-requests/${requestId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

async function latestDocumentFor(requestId) {
  const res = await api.get(`/data-requests/${requestId}/documents`)
  const docs = res.data || []
  return docs[docs.length - 1]
}

export const downloadDataFile = async (requestId) => {
  const doc = await latestDocumentFor(requestId)
  if (!doc) throw new Error('No file uploaded yet')
  const res = await api.get(`/data-requests/documents/${doc.documentId}/download`, { responseType: 'blob' })
 
  res.fileName = doc.fileName || `submission_${requestId}.pdf`
  return res
}


export const uploadReturnDocument = (returnId, file, uploadedById) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('uploadedById', uploadedById ?? localStorage.getItem('userId') ?? '')
  return api.post(`/returns/${returnId}/document`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const downloadReturnDocument = async (returnId) => {
  const res = await api.get(`/returns/${returnId}/document/download`, { responseType: 'blob' })
  const cd = res.headers?.['content-disposition'] || ''
  const match = /filename="([^"]+)"/.exec(cd)
  res.fileName = (match && match[1]) || `return_${returnId}.pdf`
  return res
}

export const getDataFileName = async (requestId) => {
  const doc = await latestDocumentFor(requestId)
  return { data: { fileName: doc?.fileName || null } }
}

export const getAllReturnsAdmin = async () => {
  const res = await api.get('/returns/getAll')
  return { ...res, data: (res.data || []).map(translateReturn) }
}
export const getAllAuditsRaw = () => api.get('/audit-reviews/getAll')
export const getAllDataRequestsAdmin = async () => {
  const res = await api.get('/data-requests/getAll')
  return { ...res, data: (res.data || []).map(translateRequest) }
}
export const getCCODashboard = () => api.get('/analytics/dashboard')

export default api
