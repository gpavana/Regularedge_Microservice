import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin() {
    if (!email || !password) {
      setMsg('Please enter both email and password')
      return
    }

    setLoading(true)
    setMsg('')

    try {
      const res = await loginUser({ email, password })
      
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('role', res.data.role)
      localStorage.setItem('userId', res.data.userId)
      localStorage.setItem('userName', res.data.name)

      const roleRoutes = {
        'ADMIN': '/users',
        'CCO': '/cco/dashboard',
        'COMPLIANCE_OFFICER': '/co/my-returns',
        'DATA_OWNER': '/dataowner/my-requests',
        'LEGAL_OFFICER': '/legal/add-penalty',
        'INTERNAL_AUDITOR': '/auditor/my-reviews'
      }

      navigate(roleRoutes[res.data.role] || '/users')

    } catch (err) {
      setMsg('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="brand">🛡️ RegulareEdge</div>
        <div className="sub">Regulatory Compliance Management System</div>

        <h2>Welcome Back</h2>

        {msg && (
          <div style={{
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
            color: '#c62828',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '500',
            textAlign: 'center',
            border: '1px solid #ef9a9a'
          }}>
            {msg}
          </div>
        )}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '24px',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '0.5px'
          }}
        >
          {loading ? '🔄 Signing In...' : '🔐 Sign In'}
        </button>

        <div className="text-center" style={{marginTop: '28px'}}>
          <p style={{fontSize: '13px', color: '#888'}}>
            Secure enterprise compliance platform
          </p>
        </div>

        </div>
      </div>
  )
}

export default Login