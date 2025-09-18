import { useState } from 'react'
import axios from 'axios'
import '../Styles/Auth.css'
import loginBackground from '../Assets/download.jfif'

const API_BASE_URL = 'http://localhost:3000'

export default function AuthenticationPage({ onAuth, onBackHome, initialMode = 'login' }: { onAuth: (user: any) => void; onBackHome: () => void; initialMode?: 'login' | 'signup' }) {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  const handleAuth = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    clearMessages()
    try {
      if (mode === 'signup') {
        const res = await axios.get(API_BASE_URL + '/create', { params: { email, password, name } })
        if (typeof res.data === 'string' && res.data.toLowerCase().includes('success')) {
          setSuccess('Account created! You can now log in.')
          setMode('login')
          setPassword('')
        } else {
          setError(res.data)
        }
      } else {
        const res = await axios.get(API_BASE_URL + '/login', { params: { email, password } })
        if (Array.isArray(res.data)) {
          const user = res.data[0]
          onAuth(user)
        } else {
          setError(res.data)
        }
      }
    } catch (err) {
      setError('API Error: ' + (err?.response?.data || err?.message || 'Unknown'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="auth-page"
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <form
        onSubmit={handleAuth}
        className="auth-form"
        style={{
          background: 'rgba(30, 30, 30, 0.85)', 
          minWidth: 320,
          maxWidth: 370,
          padding: '2rem',
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          backdropFilter: 'blur(5px)'
        }}
      >
        <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ textAlign: 'left', margin: 0, color: '#e0e0e0' }}>
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </h2>
          <button
            type='button'
            onClick={onBackHome}
            style={{
              background: 'none',
              color: '#4facfe',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: 14
            }}
            tabIndex={0}
          >
            Home
          </button>
        </div>
        {mode === 'signup' && (
          <input
            type='text'
            placeholder='Full Name'
            value={name}
            onChange={e => { setName(e.target.value); clearMessages() }}
            required
            autoFocus={mode === 'signup'}
            className={`name-input ${mode === 'signup' ? 'show' : ''}`}
            style={{
              padding: '0.7rem 1rem',
              borderRadius: 8,
              border: '1px solid #444',
              fontSize: '1rem',
              background: '#2a2a2a',
              color: '#e0e0e0'
            }}
          />
        )}
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={e => { setEmail(e.target.value); clearMessages() }}
          required
          style={{
            padding: '0.7rem 1rem',
            borderRadius: 8,
            border: '1px solid #444',
            fontSize: '1rem',
            background: '#2a2a2a',
            color: '#e0e0e0'
          }}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={e => { setPassword(e.target.value); clearMessages() }}
          required
          style={{
            padding: '0.7rem 1rem',
            borderRadius: 8,
            border: '1px solid #444',
            fontSize: '1rem',
            background: '#2a2a2a',
            color: '#e0e0e0'
          }}
          onKeyDown={e => { if (e.key === 'Enter' && !loading) handleAuth(e) }}
        />
        <button
          type='submit'
          disabled={loading}
          className="auth-button"
          style={{
            background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: '1.1rem',
            fontWeight: 600,
            padding: '0.8rem',
            cursor: 'pointer',
            marginTop: '0.5rem'
          }}
        >
          {loading
            ? <span style={{ letterSpacing: 2 }}>Please wait...</span>
            : (mode === 'login' ? 'Sign In' : 'Create Account')
          }
        </button>
        <div style={{ textAlign: 'center', marginTop: 8, color: '#b0b0b0' }}>
          {mode === 'login'
            ? <>New? <button type='button' onClick={() => { setMode('signup'); clearMessages() }} style={{ textDecoration: 'underline', background: 'none', border: 'none', color: '#4facfe', cursor: 'pointer' }}>Sign up</button></>
            : <>Have an account? <button type='button' onClick={() => { setMode('login'); clearMessages() }} style={{ textDecoration: 'underline', background: 'none', border: 'none', color: '#4facfe', cursor: 'pointer' }}>Sign in</button></>
          }
        </div>
        {success && <div style={{ color: '#4ade80', textAlign: 'center', marginTop: 4, fontWeight: 600 }}>{success}</div>}
        {error && <div style={{ color: '#f87171', fontWeight: 500, textAlign: 'center', marginTop: 3 }}>{error}</div>}
      </form>
    </div>
  )
}