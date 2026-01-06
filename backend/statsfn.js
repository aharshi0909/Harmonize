const fs = require('fs')
const path = require('path')

async function getStats(email) {
    const filePath = path.join(__dirname, 'stats', email + '.json')
    try {
        const data = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(data)
    } catch (err) {
        return { overall_accuracy: 0, note_accuracy: 0, tempo_accuracy: 0, rhythm_accuracy: 0, timbre_accuracy: 0, songs: 0 }
    }
}

async function addStats(email, data) {
    const filePath = path.join(__dirname, 'stats', email + '.json')
    console.log('Writing stats to:', filePath)

    let stats = {};
    try {
        const fileData = fs.readFileSync(filePath, 'utf8')
        stats = JSON.parse(fileData)
    } catch (err) {
        console.log('Initializing new stats file')
    }

    try {
        const currentSongs = stats.songs || 0
        const newSongs = currentSongs + 1

        const avg = (oldVal, newVal) => {
            if (currentSongs === 0) {
                return newVal || 0;
            }
            return ((oldVal || 0) * currentSongs + (newVal || 0)) / newSongs
        }

        const newStats = {
            overall_accuracy: avg(stats.overall_accuracy, data.overall_accuracy),
            note_accuracy: avg(stats.note_accuracy, data.note_accuracy),
            tempo_accuracy: avg(stats.tempo_accuracy, data.tempo_accuracy),
            rhythm_accuracy: avg(stats.rhythm_accuracy, data.rhythm_accuracy),
            timbre_accuracy: avg(stats.timbre_accuracy, data.timbre_accuracy),
            songs: newSongs
        }

        fs.writeFileSync(filePath, JSON.stringify(newStats, null, 2))
        return { success: true, stats: newStats }
    } catch (err) {
        console.log(err)
        return { success: false, error: err.message }
    }
}

module.exports = { addStats, getStats }