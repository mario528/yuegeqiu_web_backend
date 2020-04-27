const express = require('express')
const router = express.Router()
const fileType = require('./File')
router.post('/v1/user/upload/head', fileType.upLoadUserIcon)

module.exports = router