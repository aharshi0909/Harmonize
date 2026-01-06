const fs = require('fs')
const path = require('path')

function getHistory(email) {
    const filePath = path.join(__dirname, 'history', email + '.json')
    if (fs.existsSync(filePath)) {
        try {
            const file = fs.readFileSync(filePath, 'utf-8')
            return JSON.parse(file)
        } catch (err) {
            console.error('Error reading history file:', err)
            return {}
        }
    }
    return {}
}

function addHistory(email, entry) {
    const historyDir = path.join(__dirname, 'history')
    if (!fs.existsSync(historyDir)) {
        fs.mkdirSync(historyDir, { recursive: true })
    }

    const filePath = path.join(historyDir, email + '.json')
    let history = {}

    if (fs.existsSync(filePath)) {
        try {
            const file = fs.readFileSync(filePath, 'utf-8')
            history = JSON.parse(file)
        } catch (err) {
            console.error('Error reading history file:', err)
        }
    }

    const nextId = Object.keys(history).length + 1
    history[nextId] = {
        original: entry.original || 'Unknown',
        checker: entry.checker || 'Unknown',
        overall_accuracy: entry.overall_accuracy || 0,
        note_accuracy: entry.note_accuracy || 0,
        tempo_accuracy: entry.tempo_accuracy || 0,
        rhythm_accuracy: entry.rhythm_accuracy || 0,
        timbre_accuracy: entry.timbre_accuracy || 0,
        date: new Date().toISOString().split('T')[0]
    }

    try {
        fs.writeFileSync(filePath, JSON.stringify(history, null, 2))
        return true
    } catch (err) {
        console.error('Error writing history file:', err)
        return false
    }
}

module.exports = { getHistory, addHistory }
