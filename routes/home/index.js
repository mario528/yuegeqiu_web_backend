let express = require('express')
let homeBanner = require('./homeBanner')

let router = express.Router()
router.get('/v1/home/banner', homeBanner)

module.exports = router