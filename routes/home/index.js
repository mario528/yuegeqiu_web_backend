let express = require('express')
let Home = require('./Home')

let router = express.Router()
router.post('/v1/home', Home.home)

module.exports = router