import { type JSX, useState, useEffect, useCallback } from 'react'
import { FaGuitar, FaMicrophone, FaSun, FaMoon, FaUpload, FaSpinner, FaBars, FaUser, FaChartBar, FaUserCircle, FaHistory } from 'react-icons/fa'
import { GiPianoKeys, GiViolin } from 'react-icons/gi'
import axios from 'axios'
import '../Styles/Main.css'
import Stats from '../Components/Stats'
import Accounts from '../Components/Accounts'
import History from '../Components/History'

interface User {
  name: string;
  email: string;
  [key: string]: any;
}

interface MainProps {
  user: User;
  setUser: (user: User | null) => void;
}

interface Instrument {
  id: string;
  name: string;
  icon: JSX.Element;
}

interface ComparisonResult {
  results?: {
    overall_accuracy: number;
    note_accuracy: number;
    tempo_accuracy: number;
    rhythm_accuracy: number;
    timbre_accuracy: number;
    original_tempo: number;
    user_tempo: number;
  };
  [key: string]: any;
}

const instruments: Instrument[] = [
  { id: 'guitar', name: 'Guitar', icon: <FaGuitar /> },
  { id: 'piano', name: 'Piano', icon: <GiPianoKeys /> },
  { id: 'vocal', name: 'Vocals', icon: <FaMicrophone /> },
  { id: 'string', name: 'Violin', icon: <GiViolin /> },
]

const API_BASE_URL = 'http://localhost:5000'

export default function Main({ user, setUser }: MainProps) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'light' ? false : true)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeInst, setActiveInst] = useState(() => localStorage.getItem('activeInstrument') || 'guitar')
  const [orgFile, setOrgFile] = useState<File | null>(null)
  const [usrFile, setUsrFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [shProfile, setShProfile] = useState(false)
  const [resErr, setResErr] = useState('')
  const [shStats, setShStats] = useState(false)
  const [statsData, setStatsData] = useState(null)
  const [shAccs, setShAccs] = useState(false);
  const [shHist, setShHist] = useState(false)
  const [historyData, setHistoryData] = useState(null)

  const tgDark = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev
      localStorage.setItem('theme', newMode ? 'dark' : 'light')
      return newMode
    })
  }, [])

  const tgSide = useCallback(() => {
    setShowSidebar((prev) => !prev)
  }, [])

  const changeInst = useCallback((id: string) => {
    console.log('Selected instrument:', id)
    setActiveInst(id)
    localStorage.setItem('activeInstrument', id)
  }, [])

  const upOriginal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setOrgFile(f)
  }

  const upUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setUsrFile(f)
  }

  const onComp = async () => {
    if (!orgFile || !usrFile) {
      alert('Please provide both original and user audio files')
      return
    }
    setLoading(true)
    setResult(null)
    const formData = new FormData()
    formData.append('original_file', orgFile)
    formData.append('user_file', usrFile)
    formData.append('instrument', activeInst)
    const url = `${API_BASE_URL}/compare`
    console.log('API call URL:', url)
    try {
      const response = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(response.data)
      try {
        await axios.post(`http://localhost:3000/updateStats`, {
          email: user.email,
          data: response.data.results,
          filename1: orgFile.name,
          filename2: usrFile.name
        })
      } catch (err) {
        console.log(err)
        setResErr('Failed to save stats/history')
      } finally {
        alert('Comparison completed')
      }
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
    console.log('Active instrument:', activeInst)
  }, [activeInst])

  const onProfOpt = async (option: string) => {
    console.log(`Selected ${option} from profile`)
    setShProfile(false)
    if (option === 'Stats') {
      try {
        const res = await fetch(`http://localhost:3000/getStats?email=${user.email}`)
        const data = await res.json()
        setStatsData(data)
        setShStats(true)
      } catch (err) {
        console.error('Failed to fetch stats', err)
        alert('Could not load stats')
      }
    } else if (option === 'Accounts') {
      setShAccs(true);
    } else if (option === 'History') {
      try {
        const res = await fetch(`http://localhost:3000/getHistory?email=${user.email}`)
        const data = await res.json()
        setHistoryData(data)
        setShHist(true)
      } catch (err) {
        console.error('Failed to fetch history', err)
        alert('Could not load history')
      }
    }
  }

  return (
    <div className="main-content">
      <Stats isOpen={shStats} onClose={() => setShStats(false)} stats={statsData} />
      <Accounts isOpen={shAccs} onClose={() => setShAccs(false)} userEmail={user.email} onLogout={() => setUser(null)} />
      <History isOpen={shHist} onClose={() => setShHist(false)} history={historyData} />
      <header className="top-nav">
        <div className="nav-left">
          <button className="icon-button sidebar-toggle" onClick={tgSide} aria-label={showSidebar ? 'Hide sidebar' : 'Show sidebar'} title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}>
            <FaBars />
          </button>
          <span className="app-title">Harmonize</span>
        </div>
        <div className="nav-right">
          <span>Hello {user?.name}</span>
          <button onClick={tgDark} className="icon-button" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <div className="profile-section">
            <button onClick={() => setShProfile(!shProfile)} className="icon-button profile-toggle" aria-label="Toggle profile menu" title="Profile menu">
              <FaUser />
            </button>
            {shProfile && (
              <div className="profile-dropdown">
                <button className="profile-option" onClick={() => onProfOpt('Stats')} aria-label="View stats">
                  <FaChartBar /> Stats
                </button>
                <button className="profile-option" onClick={() => onProfOpt('Accounts')} aria-label="Manage accounts">
                  <FaUserCircle /> Accounts
                </button>
                <button className="profile-option" onClick={() => onProfOpt('History')} aria-label="View history">
                  <FaHistory /> History
                </button>
              </div>
            )}
          </div>
          <button onClick={() => setUser(null)} className="icon-button" title="Log out" aria-label="Log out">
            Log out
          </button>
        </div>
      </header>
      <aside className={`instrument-sidebar${showSidebar ? ' show' : ''}`}>
        {instruments.map((inst) => (
          <button key={inst.id} className={`instrument-btn${activeInst === inst.id ? ' active' : ''}`} onClick={() => changeInst(inst.id)} aria-label={`Select ${inst.name}`} aria-pressed={activeInst === inst.id}>
            <span className="instrument-icon">{inst.icon}</span>
            <span className="instrument-name">{inst.name}</span>
          </button>
        ))}
      </aside>
      <main className="instrument-display">
        <section className="instrument-header">
          <h2>
            {instruments.find((i) => i.id === activeInst)?.name}
          </h2>
        </section>
        <section className="instrument-visualization">
          <div className="file-upload-area">
            <div className="file-upload-wrapper">
              <label className={`upload-btn${orgFile ? ' has-file' : ''}`}>
                <input type="file" accept=".wav,.mp3,.flac" style={{ display: 'none' }} onChange={upOriginal} aria-label="Upload original audio file" />
                <FaUpload /> <span>{orgFile ? orgFile.name : 'Upload Original WAV File'}</span>
              </label>
            </div>
            <div className="file-upload-wrapper">
              <label className={`upload-btn${usrFile ? ' has-file' : ''}`}>
                <input type="file" accept=".wav,.mp3,.flac" style={{ display: 'none' }} onChange={upUser} aria-label="Upload audio file" />
                <FaUpload /> <span>{usrFile ? usrFile.name : 'Upload Your WAV File'}</span>
              </label>
            </div>
            <div className="compare-btn-wrapper">
              <button className="compare-btn" onClick={onComp} disabled={loading} aria-busy={loading} aria-label="Analyze and compare audio">
                {loading ? <FaSpinner className="spinner" /> : 'Analyze & Compare'}
              </button>
            </div>
          </div>
          {result && (
            <div className="comparison-results">
              <h3>Analysis Results</h3>
              {result.results && (
                <div className="results-grid">
                  <div className="result-card">
                    <div className="result-label">Overall Score</div>
                    <div className="result-value overall">{result.results.overall_accuracy}%</div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">Note Accuracy</div>
                    <div className="result-value">{result.results.note_accuracy}%</div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">Tempo Accuracy</div>
                    <div className="result-value">{result.results.tempo_accuracy}%</div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">Rhythm Accuracy</div>
                    <div className="result-value">{result.results.rhythm_accuracy}%</div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">Timbre Accuracy</div>
                    <div className="result-value">{result.results.timbre_accuracy}%</div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">Tempo Comparison</div>
                    <div className="result-value small">
                      Original: {result.results.original_tempo} BPM<br />
                      Your: {result.results.user_tempo} BPM
                    </div>
                    {resErr}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}