const fs = require('fs')
const emExs = require('email-existence')

function checkEm(email) {
  return new Promise((resolve) => {
    emExs.check(email, (err, response) => {
      if (err) {
        resolve(false)
      } else {
        resolve(response)
      }
    })
  })
}

async function create(email, data) {
  const filePath = './data/' + email + '.json'
  if (!fs.existsSync(filePath)) {
    try {
      const exists = await checkEm(email)
      if (exists) {
        const userData = {
          name: data.name || '',
          email: email,
          password: data.password || ''
        }
        const fileData = JSON.stringify(userData)
        fs.writeFileSync(filePath, fileData)
        return 'Account created successfully'
      } else {
        return 'Invalid or non-existent email address'
      }
    } catch (err) {
      return 'Error: ' + err
    }
  } else {
    return 'Error: Account already exists'
  }
}

async function del(email, password) {
  const filePath = './data/' + email + '.json'
  if (fs.existsSync(filePath)) {
    try {
      const file = fs.readFileSync(filePath, 'utf-8')
      const userData = JSON.parse(file)
      if (userData.password && userData.password === password) {
        fs.unlinkSync(filePath)
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
  const filePath = './data/' + email + '.json'
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
  const filePath = './data/' + email + '.json'
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
