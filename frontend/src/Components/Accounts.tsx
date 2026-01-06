import React, { useState } from 'react' 
import { FaTimes } from 'react-icons/fa' 

interface AccountsProps {
    isOpen: boolean 
    onClose: () => void 
    userEmail: string 
    onLogout: () => void 
}

const Accounts: React.FC<AccountsProps> = ({ isOpen, onClose, userEmail, onLogout }) => {
    const [currPass, setCurrPass] = useState('') 
    const [newPass, setNewPass] = useState('') 
    const [loading, setLoading] = useState(false) 
    const [message, setMessage] = useState('') 
    const [error, setError] = useState('') 

    if (!isOpen) return null 

    const onUpdate = async () => {
        if (!currPass || !newPass) {
            setError('Please provide both current and new passwords') 
            return 
        }
        setLoading(true) 
        setMessage('') 
        setError('') 
        try {
            const res = await fetch(`http://localhost:3000/update?email=${userEmail}&password=${currPass}&newPass=${newPass}`) 
            const text = await res.text() 
            if (text.includes('Successfully')) {
                setMessage('Password updated successfully') 
                setCurrPass('') 
                setNewPass('') 
            } else {
                setError(text) 
            }
        } catch (err) {
            setError('Failed to update password') 
        } finally {
            setLoading(false) 
        }
    } 

    const onDelete = async () => {
        if (!currPass) {
            setError('Please provide current password to delete account') 
            return 
        }
        if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            return 
        }
        setLoading(true) 
        setMessage('') 
        setError('') 
        try {
            const res = await fetch(`http://localhost:3000/delete?email=${userEmail}&password=${currPass}`) 
            const text = await res.text() 
            if (text.includes('successfully')) {
                alert('Account deleted successfully') 
                onLogout() 
            } else {
                setError(text) 
            }
        } catch (err) {
            setError('Failed to delete account') 
        } finally {
            setLoading(false) 
        }
    } 

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="modal-content" style={{ backgroundColor: '#1a1a2e', padding: '2rem', borderRadius: '15px', width: '90%', maxWidth: '500px', position: 'relative', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>
                    <FaTimes />
                </button>

                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Manage Account</h2>

                {message && <div style={{ color: '#4caf50', marginBottom: '10px', textAlign: 'center' }}>{message}</div>}
                {error && <div style={{ color: '#f44336', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Current Password</label>
                        <input type="password" value={currPass} onChange={(e) => setCurrPass(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2a2a40', color: '#fff' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>New Password (for update)</label>
                        <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2a2a40', color: '#fff' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={onUpdate} disabled={loading} style={{ flex: 1, padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#4caf50', color: '#fff', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                            Update Password
                        </button>
                        <button onClick={onDelete} disabled={loading} style={{ flex: 1, padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#f44336', color: '#fff', cursor: 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) 
} 

export default Accounts 
