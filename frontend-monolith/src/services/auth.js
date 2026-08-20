

export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(normalized))
  } catch {
    return null
  }
}

export function isLoggedIn() {
  const token = localStorage.getItem('token')
  if (!token) return false
  const payload = decodeJwt(token)
  if (!payload?.exp) return false
  return payload.exp * 1000 > Date.now()
}

export function getRole() {
  return isLoggedIn() ? localStorage.getItem('role') : null
}

export function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('userId')
  localStorage.removeItem('userName')
}
