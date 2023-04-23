const buildResponse = (statusCode, body, headers) => {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(body)
  }
}

const extractBody = (event) => {
  if (!event?.body) {
    return buildResponse(422, { error: 'Missing body!' })
  }

  return JSON.parse(event.body)
}

module.exports = {
  buildResponse,
  extractBody
}