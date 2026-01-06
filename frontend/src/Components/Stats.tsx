import React from 'react' 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts' 
import { FaTimes } from 'react-icons/fa' 

interface StatsProps {
    isOpen: boolean 
    onClose: () => void 
    stats: {
        overall_accuracy: number 
        note_accuracy: number 
        tempo_accuracy: number 
        rhythm_accuracy: number 
        timbre_accuracy: number 
        songs: number 
    } | null 
}

const Stats: React.FC<StatsProps> = ({ isOpen, onClose, stats }) => {
    if (!isOpen || !stats) return null 

    const data = [
        { name: 'Overall', value: Math.round(stats.overall_accuracy || 0), color: '#8884d8' },
        { name: 'Note', value: Math.round(stats.note_accuracy || 0), color: '#82ca9d' },
        { name: 'Tempo', value: Math.round(stats.tempo_accuracy || 0), color: '#ffc658' },
        { name: 'Rhythm', value: Math.round(stats.rhythm_accuracy || 0), color: '#ff7300' },
        { name: 'Timbre', value: Math.round(stats.timbre_accuracy || 0), color: '#0088FE' },
    ] 

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="modal-content" style={{ backgroundColor: '#1a1a2e', padding: '2rem', borderRadius: '15px', width: '90%', maxWidth: '600px', position: 'relative', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>
                    <FaTimes />
                </button>

                <h2 style={{ color: '#fff', marginBottom: '8px', textAlign: 'center' }}>Your Performance</h2>
                <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '20px' }}>
                    Average stats across {stats.songs} song{stats.songs !== 1 ? 's' : ''}
                </p>

                <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" domain={[0, 100]} />
                            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.1)' }} />
                            <Bar dataKey="value" name="Score">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    ) 
} 

export default Stats 
