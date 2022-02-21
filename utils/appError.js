class CustomAPIError extends Error {
  constructor(message, statusCode) {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }

    Error.captureStackTrace(this, this.constructor)
  }
}

const createCustomError = (msg, statusCode) => {
  return new CustomAPIError(msg, statusCode)
}

export { createCustomError, CustomAPIError }
