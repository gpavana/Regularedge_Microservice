import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/api'
import { getRole, clearSession } from '../../services/auth'

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    businessUnitId: 1,
    role: 'COMPLIANCE_OFFICER'
  })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const isAdmin = getRole() === 'ADMIN'

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleRegister() {
    if (!form.name || !form.email || !form.password || !form.phone) {
      setMsg('error:Please fill all fields')
      return
    }

    // Self-registration (no one logged in) may only create an ADMIN account -
    // every other role has to be added by an already-logged-in ADMIN.
    const role = isAdmin ? form.role : 'ADMIN'

    // Auto-assign business unit based on role
    let businessUnitId = 1
    if (role === 'DATA_OWNER') businessUnitId = 2
    else if (role === 'LEGAL_OFFICER') businessUnitId = 3
    else if (role === 'INTERNAL_AUDITOR') businessUnitId = 4
    // ADMIN, COMPLIANCE_OFFICER, CCO = 1

    setLoading(true)
    setMsg('')

    try {
      await registerUser({...form, role, businessUnitId})
      if (isAdmin) {
        setMsg('success:User registered successfully!')
        setTimeout(() => {
          setForm({
            name: '',
            email: '',
            password: '',
            phone: '',
            businessUnitId: 1,
            role: 'COMPLIANCE_OFFICER'
          })
          setMsg('')
        }, 2000)
      } else {
        setMsg('success:Account created! Sign in to continue.')
        setForm({
          name: '',
          email: '',
          password: '',
          phone: '',
          businessUnitId: 1,
          role: 'COMPLIANCE_OFFICER'
        })
      }
    } catch (err) {
      console.error(err)
      if (err.response?.status === 409) {
        setMsg('error:User already exists')
      } else {
        setMsg('error:Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    clearSession()
    navigate('/login')
  }

  return (
    <div>
      <nav>
        <h1>RegulareEdge</h1>
        <div>
          {isAdmin ? (
            <>
              <a href="/users">All Users</a>
              <a href="/register">Add User</a>
              <a href="/admin/add-regulator">Add Regulator</a>
              <a href="/admin/all-regulators">All Regulators</a>
              <a href="/admin/add-obligation">Add Obligation</a>
              <a href="/admin/all-obligations">All Obligations</a>
              <a href="/admin/add-deadline">Add Deadline</a>
              <a onClick={handleLogout} style={{cursor:'pointer'}}>Logout</a>
            </>
          ) : (
            <a href="/login">Sign In</a>
          )}
        </div>
      </nav>

      <div className="page">
        <div className="card" style={{maxWidth:'600px',margin:'30px auto'}}>
          <h2>{isAdmin ? 'Register New User' : 'Register as Administrator'}</h2>
          <p style={{color:'#666',marginBottom:'16px'}}>
            {isAdmin
              ? 'Create an account on behalf of a user'
              : 'Self-registration creates an ADMIN account. Sign in as an ADMIN to add users of any other role.'}
          </p>

          {msg && <div className={msg.startsWith('error') ? 'msg-error' : 'msg-success'}>
            {msg.replace('error:', '').replace('success:', '')}
          </div>}

          <div className="form-group">
            <label>Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Rahul Kumar" />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="co@gmail.com" />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter password" />
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
          </div>

          {isAdmin ? (
            <div className="form-group">
              <label>Role *</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="ADMIN">ADMIN (Business Unit: 1 - Head Office)</option>
                <option value="COMPLIANCE_OFFICER">COMPLIANCE_OFFICER (Business Unit: 1 - Compliance)</option>
                <option value="DATA_OWNER">DATA_OWNER (Business Unit: 2 - Data Dept)</option>
                <option value="INTERNAL_AUDITOR">INTERNAL_AUDITOR (Business Unit: 4 - Audit Dept)</option>
                <option value="LEGAL_OFFICER">LEGAL_OFFICER (Business Unit: 3 - Legal Dept)</option>
                <option value="CCO">CCO (Business Unit: 1 - Compliance Head)</option>
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label>Role</label>
              <input value="ADMIN (Business Unit: 1 - Head Office)" disabled style={{background:'#f5f5f5'}} />
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleRegister}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Registering...' : 'Register User'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register