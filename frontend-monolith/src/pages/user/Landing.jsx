import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="brand">🛡️ RegulareEdge</div>
        <div className="sub">Regulatory Compliance Management System</div>

        <h2>Welcome</h2>

        <p style={{ color: '#666', fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}>
          Already have an account? Sign in. New here? Create an account first.
        </p>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/login')}
          style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: '700' }}
        >
          🔐 Sign In
        </button>

{/*         <button */}
{/*           className="btn btn-secondary" */}
{/*           onClick={() => navigate('/register')} */}
{/*           style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: '700', marginTop: '12px' }} */}
{/*         > */}
{/*           📝 Register */}
{/*         </button> */}

        <div className="text-center" style={{ marginTop: '28px' }}>
          <p style={{ fontSize: '13px', color: '#888' }}>
            Secure enterprise compliance platform
          </p>
        </div>
      </div>
    </div>
  )
}

export default Landing
