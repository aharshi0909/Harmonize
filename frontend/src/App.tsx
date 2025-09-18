import { useState } from 'react'
import Main from './Pages/Main'
import Home from './Pages/Home'
import AuthenticationPage from './Pages/AuthenticationPage'

export default function App() {
  const [user, setUser] = useState(null)
  const [showHome, setShowHome] = useState(true)
  const [initialMode, setInitialMode] = useState<'login' | 'signup'>('login')

  if (user)
    return <Main user={user} setUser={setUser} />

  if (showHome)
    return <Home
      onLogin={() => { setInitialMode('login'); setShowHome(false) }}
      onSignup={() => { setInitialMode('signup'); setShowHome(false) }}
    />

  return (
    <AuthenticationPage
      onAuth={setUser}
      onBackHome={() => setShowHome(true)}
      initialMode={initialMode}
    />
  )
}