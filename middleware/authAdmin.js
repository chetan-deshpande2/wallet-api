import Users from '../model/userModel'
import asyncWrapper from '../utils/asyncWrapper'

const authAdmin = asyncWrapper(async (req, res, next) => {
  const user = await Users.findOne({ _id: req.user.id })
  if (user.role !== 1) {
    return res.status(500).json({ msg: 'Access Denied' })
  }
  next()
})

export default authAdmin
