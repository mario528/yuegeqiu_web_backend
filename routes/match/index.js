const express = require('express')
const router = express.Router()
const MatchType = require('./Match')

router.get('/v1/match/create/detail', MatchType.getCreateMatchDetail)
router.post('/v1/match/create', MatchType.createMatch)
module.exports = router