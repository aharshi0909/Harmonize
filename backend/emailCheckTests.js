const validator = require('validator')
const dns = require('dns').promises

async function checkEm(email) {
  if (!validator.isEmail(email)) return false
  const domain = email.split('@')[1]
  try {
    const mxRecords = await dns.resolveMx(domain)
    return mxRecords && mxRecords.length > 0
  } catch (err) {
    console.error('MX check failed for', domain, ':', err.code)
    return false
  }
}
