const express = require('express')
const router = express.Router()
const fileType = require('./File')
router.post('/v1/user/upload/icon', fileType.upLoadUserIcon)
router.post('/v1/team/upload/icon', fileType.uploadTeamIcon)
module.exports = router