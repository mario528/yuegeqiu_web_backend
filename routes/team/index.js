const express = require('express')
const router = express.Router()
const teamType = require('./Team')

router.get('/v1/user/team/info', teamType.getUserTeamInfo)
router.post('/v1/team/create', teamType.createTeam)
router.post('/v1/team/detail', teamType.getTeamDetail)
router.post('/v1/team/update/inform', teamType.updateTeamInform)
router.post('/v1/team/activity/role', teamType.getActivityRole)
router.post('/v1/team/activity/create', teamType.createTeamActivity)
router.post('/v1/team/search', teamType.findTeam)
router.post('/v1/team/join', teamType.joinTeam)
router.post('/v1/team/depart', teamType.departTeam)
module.exports = router