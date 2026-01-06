import { useState, useEffect, useRef } from 'react'
import { FaArrowDown, FaArrowRight, FaGuitar, FaMicrophone, FaTimes } from 'react-icons/fa'
import { GiPianoKeys, GiViolin } from 'react-icons/gi'
import { MdLibraryMusic, MdGraphicEq } from 'react-icons/md'
import heroImage from '../Assets/hp1.jpg'
import heroImage2 from '../Assets/hp2.jpg'
import heroImage3 from '../Assets/hp3.jpg'
import heroImage5 from '../Assets/hp5.jpg'
import '../Styles/Home.css'
import Tilt from 'react-parallax-tilt'

interface HomeProps {
  onLogin: () => void;
  onSignup: () => void;
}

interface InstrumentData {
  title: string;
  description: string;
  image: string;
}

interface InstrumentDataMap {
  guitar: InstrumentData;
  piano: InstrumentData;
  vocals: InstrumentData;
  strings: InstrumentData;
}

interface VisitedSections {
  features: boolean;
  instruments: boolean;
}

const instrumentData: InstrumentDataMap = {
  guitar: {
    title: "Guitar",
    description: "Analyze your chords, scales, and finger positioning with our advanced guitar tracking system. Perfect for both acoustic and electric players.",
    image: heroImage2
  },
  piano: {
    title: "Piano",
    description: "Master your keyboard skills with real-time feedback on note accuracy, timing, and dynamics. Suitable for all piano types.",
    image: heroImage
  },
  vocals: {
    title: "Vocals",
    description: "Improve your pitch, tone, and breathing techniques with our vocal analysis tools. Great for singers of all genres.",
    image: heroImage3
  },
  strings: {
    title: "Violin",
    description: "From violin to cello, our system helps you perfect your bowing technique and intonation.",
    image: heroImage5
  }
}

export default function Home({ onLogin, onSignup }: HomeProps) {
  const featRef = useRef<HTMLElement>(null)
  const authRef = useRef<HTMLElement>(null)
  const instRef = useRef<HTMLElement>(null)
  const [activeFeat, setActiveFeat] = useState(0)
  const [animatedText, setAnimatedText] = useState('')
  const [selInst, setSelInst] = useState<keyof InstrumentDataMap | null>(null)
  const [visSects, setVisSects] = useState<VisitedSections>({
    features: false,
    instruments: false,
  })
  const phrases = ["your guitar skills", "piano mastery", "vocal range", "music production"]
  const [currPIdx, setCurrPIdx] = useState(0)
  const [cIdx, setCIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const baseText = "Elevate "
  const homeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeat(prev => (prev + 1) % 4)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const typeEffect = () => {
      const currentPhrase = phrases[currPIdx]
      if (isDeleting) {
        setAnimatedText(baseText + currentPhrase.substring(0, cIdx - 1))
        setCIdx(cIdx - 1)
        if (cIdx === 0) {
          setIsDeleting(false)
          setCurrPIdx((currPIdx + 1) % phrases.length)
        }
      } else {
        setAnimatedText(baseText + currentPhrase.substring(0, cIdx + 1))
        setCIdx(cIdx + 1)
        if (cIdx === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 1500)
        }
      }
    }
    const timer = setTimeout(typeEffect, isDeleting ? 50 : 100)
    return () => clearTimeout(timer)
  }, [cIdx, currPIdx, isDeleting, phrases])

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === featRef.current && !visSects.features) {
            setVisSects(prev => ({ ...prev, features: true }))
          }
          if (entry.target === instRef.current && !visSects.instruments) {
            setVisSects(prev => ({ ...prev, instruments: true }))
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    if (featRef.current) observer.observe(featRef.current)
    if (instRef.current) observer.observe(instRef.current)

    return () => {
      if (featRef.current) observer.unobserve(featRef.current)
      if (instRef.current) observer.unobserve(instRef.current)
    }
  }, [visSects])

  const toFeats = () => {
    featRef.current?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => {
      window.scrollBy({ top: 50, behavior: 'smooth' })
    }, 800)
  }

  const toAuth = () => {
    authRef.current?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => {
      window.scrollBy({ top: 50, behavior: 'smooth' })
    }, 800)
  }

  const onInstClick = (instrument: keyof InstrumentDataMap) => {
    setSelInst(instrument)
    document.body.style.overflow = 'hidden'
  }

  const closePopup = () => {
    setSelInst(null)
    document.body.style.overflow = 'auto'
  }

  return (
    <div className="home-container" ref={homeRef}>
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="animated-text">{animatedText}</span>
              <span className="cursor"></span>
            </h1>
            <p className="hero-subtitle">Professional audio analysis to take your music to the next level</p>
            <div className="hero-buttons">
              <button className="primary-button" onClick={toAuth}>
                Get Started <FaArrowRight />
              </button>
              <button className="secondary-button" onClick={toFeats}>
                Learn More <FaArrowDown />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section ref={featRef} className={`features-section ${visSects.features ? 'visited' : ''}`}>
        <div className="section-header">
          <h2>Why Choose Our Platform</h2>
          <p>Advanced tools for musicians at every level</p>
        </div>

        <div className="features-grid">
          <div className={`feature-card ${activeFeat === 0 ? 'active' : ''}`}>
            <div className="feature-icon">
              <MdGraphicEq />
            </div>
            <h3>Real-Time Analysis</h3>
            <p>Get instant feedback on pitch, rhythm, and tone as you play</p>
          </div>

          <div className={`feature-card ${activeFeat === 1 ? 'active' : ''}`}>
            <div className="feature-icon">
              <GiPianoKeys />
            </div>
            <h3>Multi-Instrument</h3>
            <p>Supports guitar, piano, vocals, and more</p>
          </div>

          <div className={`feature-card ${activeFeat === 2 ? 'active' : ''}`}>
            <div className="feature-icon">
              <MdLibraryMusic />
            </div>
            <h3>Song Library</h3>
            <p>Practice with your own preferred original audios</p>
          </div>

          <div className={`feature-card ${activeFeat === 3 ? 'active' : ''}`}>
            <div className="feature-icon">
              <MdLibraryMusic />
            </div>
            <h3>Progress Tracking</h3>
            <p>Visualize your improvement over time</p>
          </div>
        </div>

        <button className="cta-button" onClick={toAuth}>
          Start Your Musical Journey
        </button>
      </section>

      <section ref={instRef} className={`instruments-section ${visSects.instruments ? 'visited' : ''}`}>
        <div className="section-header">
          <h2>Supported Instruments</h2>
          <p>We help you master your instrument of choice</p>
        </div>

        <div className="instruments-grid">
          <Tilt>
            <div className="instrument-card" onClick={() => onInstClick('guitar')}>
              <div className="instrument-icon">
                <FaGuitar />
              </div>
              <h3>
                Guitar<br /><p className='know'>(Click to know more)</p>
              </h3>
            </div>
          </Tilt>
          <Tilt>
            <div className="instrument-card" onClick={() => onInstClick('piano')}>
              <div className="instrument-icon">
                <GiPianoKeys />
              </div>
              <h3>
                Piano<br /><p className='know'>(Click to know more)</p>
              </h3>
            </div>
          </Tilt>
          <Tilt>
            <div className="instrument-card" onClick={() => onInstClick('vocals')}>
              <div className="instrument-icon">
                <FaMicrophone />
              </div>
              <h3>
                Vocals<br /><p className='know'>(Click to know more)</p>
              </h3>
            </div>
          </Tilt>
          <Tilt>
            <div className="instrument-card" onClick={() => onInstClick('strings')}>
              <div className="instrument-icon">
                <GiViolin />
              </div>
              <h3>
                Violin<br /><p className='know'>(Click to know more)</p>
              </h3>
            </div>
          </Tilt>
        </div>
      </section>

      <section ref={authRef} className="auth-section">
        <div className="auth-container">
          <div className="auth-content">
            <h2>Ready to Transform Your Music?</h2>
            <p>Join thousands of musicians improving their skills daily</p>

            <div className="auth-options">
              <div className="auth-card">
                <h3>New to Harmonize?</h3>
                <button className="auth-button" onClick={onSignup}>
                  Sign Up Free
                </button>
                <p>Free forever</p>
              </div>

              <div className="auth-divider">
                <span>OR</span>
              </div>

              <div className="auth-card">
                <h3>Existing User?</h3>
                <button className="auth-button" onClick={onLogin}>
                  Log In
                </button>
                <p>Continue your musical journey</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selInst && (
        <div className="instrument-popup-overlay">
          <div className="instrument-popup">
            <button className="close-popup" onClick={closePopup}>
              <FaTimes />
            </button>
            <div className="popup-content">
              <div className="popup-image">
                <img src={instrumentData[selInst].image} alt={selInst} />
              </div>
              <div className="popup-text">
                <h3>{instrumentData[selInst].title}</h3>
                <p>{instrumentData[selInst].description}</p>
                <button className="popup-button" onClick={closePopup}>
                  Got It!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}