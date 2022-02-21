class CustomAPIError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}

const createCustomError = (msg, statusCode) => {
  return CustomAPIError(msg, statusCode)
}

export { CustomAPIError, createCustomError }
