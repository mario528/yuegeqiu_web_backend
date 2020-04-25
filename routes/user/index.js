const express = require('express')
const router = express.Router()
const User = require('./User')
let userType = new User()

router.post('/v1/login', userType.login)
router.post('/v1/register', userType.register)
router.get('/v1/logout', userType.logout)
router.get('/v1/token/state', userType.getTokenState)
router.get('/v1/verification_message', userType.getVerificationCode)

module.exports = router