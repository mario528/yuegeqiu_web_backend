const express = require('express')
const router = express.Router()
const teamType = require('./Team')

router.get('/v1/user/team/info', teamType.getUserTeamInfo)
router.post('/v1/team/create', teamType.createTeam)
router.post('/v1/team/detail', teamType.getTeamDetail)
router.post('/v1/team/update/inform', teamType.updateTeamInform)
module.exports = router