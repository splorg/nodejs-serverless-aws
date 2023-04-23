const { pbkdf2Sync } = require('crypto')
const { sign, verify } = require('jsonwebtoken')

const { buildResponse } = require('./utils')

const createToken = (username, id) => {
  const token = sign({ username, id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
    audience: 'alura-serverless'
  })

  return token
}

const authorize = (header) => {
  if (!header) return buildResponse(401, { error: 'Missing authorization header! '})

  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) return buildResponse(401, { error: 'Invalid authorization header!' })

  try {
    const decodedToken = verify(token, process.env.JWT_SECRET, { audience: 'alura-serverless' })

    if (!decodedToken) return buildResponse(401, { error: 'Invalid token!' })
  } catch (err) {
    return buildResponse(401, { error: 'Invalid token!' })
  }
}

const makeHash = (data) => {
  return pbkdf2Sync(data, process.env.SALT, 100000, 64, 'sha512').toString('hex')
}

module.exports = {
  createToken,
  authorize,
  makeHash
}