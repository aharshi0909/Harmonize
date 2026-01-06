const fs = require('fs')
const path = require('path')

async function create(email, data) {
  const filePath = path.join(__dirname, 'data', email + '.json')
  if (!fs.existsSync(filePath)) {
    try {
        const userData = {
          name: data.name || '',
          email: email,
          password: data.password || ''
        }
        const fileData = JSON.stringify(userData)
        fs.writeFileSync(filePath, fileData)

        const statsPath = path.join(__dirname, 'stats', email + '.json')
        fs.writeFileSync(statsPath, JSON.stringify({
          overall_accuracy: 0,
          note_accuracy: 0,
          tempo_accuracy: 0,
          rhythm_accuracy: 0,
          timbre_accuracy: 0,
          songs: 0
        }))

        const historyPath = path.join(__dirname, 'history', email + '.json')
        fs.writeFileSync(historyPath, JSON.stringify({}))
        console.log('Stats and History files created successfully')
        return 'Account created successfully'
    } catch (err) {
      return 'Error: ' + err
    }
  } else {
    return 'Error: Account already exists'
  }
}

async function del(email, password) {
  const filePath = path.join(__dirname, 'data', email + '.json')
  if (fs.existsSync(filePath)) {
    try {
      const file = fs.readFileSync(filePath, 'utf-8')
      const userData = JSON.parse(file)
      if (userData.password && userData.password === password) {
        fs.unlinkSync(filePath)
        const statsPath = path.join(__dirname, 'stats', email + '.json')
        const historyPath = path.join(__dirname, 'history', email + '.json')
        if (fs.existsSync(statsPath)) fs.unlinkSync(statsPath)
        if (fs.existsSync(historyPath)) fs.unlinkSync(historyPath)
        return 'Account deleted successfully'
      } else {
        return 'Wrong password'
      }
    } catch (err) {
      return 'Error: ' + err
    }
  } else {
    return 'Your account may not have been created'
  }
}

async function login(email, password) {
  const filePath = path.join(__dirname, 'data', email + '.json')
  if (fs.existsSync(filePath)) {
    try {
      const file = fs.readFileSync(filePath, 'utf-8')
      const userData = JSON.parse(file)
      if (userData.password && userData.password === password) {
        return [userData, 'Successfully logged in']
      } else {
        return 'Wrong password'
      }
    } catch (err) {
      return 'Error: ' + err
    }
  } else {
    return 'Account not found'
  }
}

async function update(email, newData) {
  const filePath = path.join(__dirname, 'data', email + '.json')
  if (fs.existsSync(filePath)) {
    try {
      const file = fs.readFileSync(filePath, 'utf-8')
      const userData = JSON.parse(file)
      const updatedUser = {
        name: userData.name,
        email: userData.email,
        password: newData.password || userData.password
      }
      const fileData = JSON.stringify(updatedUser)
      fs.writeFileSync(filePath, fileData)
      return 'Successfully changed the data'
    } catch (err) {
      return 'Error: ' + err
    }
  } else {
    return 'Error in account'
  }
}

module.exports = { create, del, login, update }
