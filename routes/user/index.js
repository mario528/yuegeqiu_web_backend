const express = require('express')
const router = express.Router()
const userType = require('./User')

router.post('/v1/login', userType.login)
router.post('/v1/register', userType.register)
router.get('/v1/logout', userType.logout)
router.get('/v1/token/state', userType.getTokenState)
router.get('/v1/verification_message', userType.getVerificationCode)
router.post('/v1/user/info/complete', userType.completeUserInfo)
router.post('/v1/user/info', userType.getUserInfo)
router.post('/v1/user/center', userType.getUserCenterData)
module.exports = router