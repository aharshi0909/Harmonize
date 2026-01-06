import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import Main from './Pages/Main'
import Home from './Pages/Home'
import Auth from './Pages/Auth'

function AppContent() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/auth?mode=login')
  }

  const handleSignup = () => {
    navigate('/auth?mode=signup')
  }

  const handleAuth = (userData: any) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    navigate('/app')
  }

  const handleBackHome = () => {
    navigate('/')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ?
            <Navigate to="/app" replace /> :
            <Home onLogin={handleLogin} onSignup={handleSignup} />
        }
      />
      <Route
        path="/auth"
        element={
          user ?
            <Navigate to="/app" replace /> :
            <AuthPageWrapper onAuth={handleAuth} onBackHome={handleBackHome} />
        }
      />
      <Route
        path="/app"
        element={
          user ?
            <Main user={user} setUser={handleLogout} /> :
            <Navigate to="/" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function AuthPageWrapper({ onAuth, onBackHome }: { onAuth: (user: any) => void; onBackHome: () => void }) {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'

  return <Auth onAuth={onAuth} onBackHome={onBackHome} initialMode={mode} />
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}