import { useState, useEffect, useCallback } from 'react'
import { FaGuitar, FaMicrophone, FaSun, FaMoon, FaUpload, FaSpinner, FaYoutube, FaBars } from 'react-icons/fa'
import { GiPianoKeys, GiViolin } from 'react-icons/gi'
import axios from 'axios'
import '../Styles/Main.css'

const instruments = [
  { id: 'guitar', name: 'Guitar', icon: <FaGuitar /> },
  { id: 'piano', name: 'Piano', icon: <GiPianoKeys /> },
  { id: 'vocal', name: 'Vocals', icon: <FaMicrophone /> },
  { id: 'string', name: 'Strings', icon: <GiViolin /> },
]

const API_BASE_URL = 'http://localhost:3000'

export default function Main({ user, setUser }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'light' ? false : true)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeInstrument, setActiveInstrument] = useState(() => localStorage.getItem('activeInstrument') || 'guitar')
  const [youtubeLink, setYoutubeLink] = useState('')
  const [userFile, setUserFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev
      localStorage.setItem('theme', newMode ? 'dark' : 'light')
      return newMode
    })
  }, [])

  const toggleSidebar = useCallback(() => {
    setShowSidebar((prev) => !prev)
  }, [])

  const handleInstrumentChange = useCallback((id) => {
    console.log('Selected instrument:', id)
    setActiveInstrument(id)
    localStorage.setItem('activeInstrument', id)
  }, [])

  const handleFileUpload = (e: any) => {
    const f = e.target.files?.[0]
    if (!f) return
    setUserFile(f)
  }

  const handleCompare = async () => {
    if (!youtubeLink || !userFile) {
      alert('Please provide both YouTube link and audio file')
      return
    }
    setLoading(true)
    setResult(null)
    const formData = new FormData()
    formData.append('youtube_url', youtubeLink)
    formData.append('user_file', userFile)
    const url = `${API_BASE_URL}/compare-${activeInstrument}`
    console.log('API call URL:', url)
    try {
      const response = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(response.data)
    } catch (err) {
      alert('Comparison failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    const resize = () => {
      const isMobile = window.innerWidth <= 768
      setShowSidebar(!isMobile)
    }
    window.addEventListener('resize', resize)
    resize()
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    console.log('Active instrument:', activeInstrument)
  }, [activeInstrument])

  return (
    <div className="main-content">
      <header className="top-nav">
        <div className="nav-left">
          <button
            className="icon-button sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
            title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
          >
            <FaBars />
          </button>
          <span className="app-title">Harmonize</span>
        </div>
        <div className="nav-right">
          <span>Hello {user?.name}</span>
          <button
            onClick={toggleDarkMode}
            className="icon-button"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button
            onClick={() => setUser(null)}
            className="icon-button"
            title="Log out"
            aria-label="Log out"
          >
            Log out
          </button>
        </div>
      </header>
      <aside className={`instrument-sidebar${showSidebar ? ' show' : ''}`}>
        {instruments.map((inst) => (
          <button
            key={inst.id}
            className={`instrument-btn${activeInstrument === inst.id ? ' active' : ''}`}
            onClick={() => handleInstrumentChange(inst.id)}
            aria-label={`Select ${inst.name}`}
            aria-pressed={activeInstrument === inst.id}
          >
            <span className="instrument-icon">{inst.icon}</span>
            <span className="instrument-name">{inst.name}</span>
          </button>
        ))}
      </aside>
      <main className="instrument-display">
        <section className="instrument-header">
          <h2>{instruments.find((i) => i.id === activeInstrument)?.name}</h2>
        </section>
        <section className="instrument-visualization">
          <div className="file-upload-area">
            <div className="youtube-input-container">
              <span className="youtube-icon"><FaYoutube /></span>
              <input
                className="youtube-input"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                placeholder="Enter YouTube URL"
                aria-label="Enter YouTube URL"
              />
            </div>
            <label className={`upload-btn${userFile ? ' has-file' : ''}`}>
              <input
                type="file"
                accept=".wav,.mp3,.flac"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                aria-label="Upload audio file"
              />
              <FaUpload /> <span>{userFile ? userFile.name : 'Upload Your WAV File'}</span>
            </label>
            <button
              className="compare-btn"
              onClick={handleCompare}
              disabled={loading}
              aria-busy={loading}
              aria-label="Analyze and compare audio"
            >
              {loading ? <FaSpinner className="spinner" /> : 'Analyze & Compare'}
            </button>
          </div>
          {result && (
            <div className="comparison-results">
              <h3>Results</h3>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}