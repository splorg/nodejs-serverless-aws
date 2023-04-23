'use strict'
const { buildResponse, extractBody } = require('./utils')
const { getUserByCredentials, saveResults, getResultByID } = require('./database')
const { makeHash, createToken, authorize } = require('./auth')
const { countCorrectAnswers } = require('./responses')

module.exports.login = async (event) => {
  const { username, password } = extractBody(event)

  const hashedPass = makeHash(password)

  const user = await getUserByCredentials(username, hashedPass)

  if (!user) {
    return buildResponse(401, { error: 'Invalid Credentials' })
  }

  return buildResponse(200, 
    { token: createToken(username, user._id) }
  )
}

module.exports.sendResponse = async (event) => {
  const authResult = authorize(event)

  if (authResult.statusCode === 401) return authResult

  const { name, answers } = extractBody(event)

  const result = countCorrectAnswers(name, answers)

  const insertedId = await saveResults(result)

  return buildResponse(201, {
    resultId: insertedId,
    __hypermedia: {
      href: `/results.html`,
      query: { id: insertedId }
    }
  })
}

module.exports.getResult = async (event) => {
  const authResult = await authorize(event)

  if (authResult.statusCode === 401) return authResult

  const result = await getResultByID(event.pathParameters.id)

  if (!result) {
    return buildResponse(404, { error: 'Result not found' })
  }
  
  return buildResponse(200, result)
}