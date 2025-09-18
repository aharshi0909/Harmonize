const express = require('express')
const cors = require('cors') 
const dataFunc = require('./datafn')
const app = express()

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type'], 
}))

app.use(express.json())

app.get('/create', async (req, res) => {
  const email = req.query.email
  const password = req.query.password
  const name = req.query.name
  if (!email || !password || !name) {
    res.send('Please provide email, password, and name')
    return
  }
  const result = await dataFunc.create(email, { password: password, name: name })
  res.send(result)
})

app.get('/login', async (req, res) => {
  const email = req.query.email
  const password = req.query.password
  if (!email || !password) {
    res.send('Please provide both email and password')
    return
  }
  const result = await dataFunc.login(email, password)
  res.send(result)
})

app.get('/delete', async (req, res) => {
  const email = req.query.email
  const password = req.query.password
  if (!email || !password) {
    res.send('Please provide both email and password')
    return
  }
  const result = await dataFunc.del(email, password)
  res.send(result)
})

app.get('/update', async (req, res) => {
  const email = req.query.email
  const password = req.query.password
  const newPass = req.query.newPass
  if (!email || !password || !newPass) {
    res.send('Please provide email, current password, and new password')
    return
  }
  const logRes = await dataFunc.login(email, password)
  if (typeof logRes === 'string' && logRes !== 'Successfully logged in') {
    res.send('Cannot update: ' + logRes)
    return
  }
  const fileContent = require('fs').readFileSync('./data/' + email + '.json', 'utf-8')
  const userData = JSON.parse(fileContent)
  const updRes = await dataFunc.update(email, { password: newPass, name: userData.name })
  res.send(updRes)
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})