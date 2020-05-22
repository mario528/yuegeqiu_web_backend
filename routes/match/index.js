const express = require('express')
const router = express.Router()
const MatchType = require('./Match')

router.get('/v1/time/get', MatchType.getTime)
router.post('/v1/match/create', MatchType.createMatch)
module.exports = router