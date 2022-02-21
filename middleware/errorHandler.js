import createCustomError from '../utils/appError'

const errorHandler = (err, req, res, next) => {
  if (err instanceof createCustomError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  return res.status(err.status).json({ msg: err.message })
}

export default errorHandler
