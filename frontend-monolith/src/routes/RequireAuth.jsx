import { Navigate } from 'react-router-dom'
import { isLoggedIn, getRole } from '../services/auth'


export default function RequireAuth({ roles, children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  if (roles && roles.length > 0 && !roles.includes(getRole())) {
    return <Navigate to="/login" replace />
  }
  return children
}
