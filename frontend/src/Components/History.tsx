import { useState } from 'react'
import { FaTimes, FaHistory, FaChevronRight, FaChevronDown } from 'react-icons/fa'

interface HistoryEntry {
    original: string 
    checker: string 
    overall_accuracy: number 
    note_accuracy: number 
    tempo_accuracy: number 
    rhythm_accuracy: number 
    timbre_accuracy: number 
    date: string 
}

interface HistoryData {
    [key: string]: HistoryEntry 
}

interface HistoryModalProps {
    isOpen: boolean 
    onClose: () => void 
    history: HistoryData | null 
}

export default function History({ isOpen, onClose, history }: HistoryModalProps) {
    const [expId, setExpId] = useState<string | null>(null) 

    if (!isOpen) return null 

    const stripExt = (name: string) => name.replace(/\.[^/.]+$/, "") 

    const sortedHist = history ? Object.entries(history).sort((a, b) => b[1].date.localeCompare(a[1].date)) : [] 
    return (
        <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="modal-container history-modal" onClick={e => e.stopPropagation()} style={{ backgroundColor: '#1a1a2e', padding: '1.5rem', borderRadius: '15px', width: '90%', maxWidth: '600px', position: 'relative', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', maxHeight: '80vh', overflowY: 'auto' }}>
                <header className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaHistory />
                        <h2 style={{ margin: 0 }}>Comparison History</h2>
                    </div>
                    <button className="close-btn" onClick={onClose} aria-label="Close modal" style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>
                        <FaTimes />
                    </button>
                </header>

                <div className="modal-content">
                    {!history || sortedHist.length === 0 ? (
                        <div className="empty-state">
                            <p>No history available yet. Start comparing to see your progress!</p>
                        </div>
                    ) : (
                        <div className="history-list">
                            {sortedHist.map(([id, entry]) => (
                                <div key={id} className="history-item">
                                    <div className="history-summary" onClick={() => setExpId(expId === id ? null : id)}>
                                        <div className="summary-info">
                                            <div className="song-names">
                                                <strong>Original:</strong> {stripExt(entry.original)} <br />
                                                <strong>User:</strong> {stripExt(entry.checker)}
                                            </div>
                                            <div className="history-date">{entry.date}</div>
                                        </div>
                                        <div className="expand-icon">
                                            {expId === id ? <FaChevronDown /> : <FaChevronRight />}
                                        </div>
                                    </div>

                                    {expId === id && (
                                        <div className="history-details">
                                            <div className="details-grid">
                                                <div className="detail-row">
                                                    <span>Overall Score</span>
                                                    <span className="detail-value">{entry.overall_accuracy}%</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span>Note Accuracy</span>
                                                    <span>{entry.note_accuracy}%</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span>Tempo Accuracy</span>
                                                    <span>{entry.tempo_accuracy}%</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span>Rhythm Accuracy</span>
                                                    <span>{entry.rhythm_accuracy}%</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span>Timbre Accuracy</span>
                                                    <span>{entry.timbre_accuracy}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
        .history-list {
          display: flex 
          flex-direction: column 
          gap: 0.75rem 
        }
        .history-item {
          background: rgba(255, 255, 255, 0.05) 
          border-radius: 8px 
          overflow: hidden 
          border: 1px solid rgba(255, 255, 255, 0.1) 
          transition: background 0.2s 
        }
        .history-item:hover {
          background: rgba(255, 255, 255, 0.08) 
        }
        .history-summary {
          padding: 1rem 
          cursor: pointer 
          display: flex 
          justify-content: space-between 
          align-items: center 
        }
        .summary-info {
          display: flex 
          flex-direction: column 
          gap: 0.25rem 
        }
        .song-names {
          font-size: 0.95rem 
          line-height: 1.4 
          color: #eee 
        }
        .history-date {
          font-size: 0.8rem 
          color: #aaa 
        }
        .history-details {
          padding: 0 1rem 1rem 1rem 
          border-top: 1px solid rgba(255, 255, 255, 0.05) 
          background: rgba(0, 0, 0, 0.2) 
        }
        .details-grid {
          display: flex 
          flex-direction: column 
          gap: 0.5rem 
          padding-top: 1rem 
        }
        .detail-row {
          display: flex 
          justify-content: space-between 
          font-size: 0.9rem 
          color: #ccc 
        }
        .detail-value {
          color: #4facfe 
          font-weight: bold 
        }
        .expand-icon {
          color: #4facfe 
        }
        .empty-state {
          text-align: center 
          padding: 2rem 
          color: #888 
        }
      `}</style>
        </div>
    ) 
}
