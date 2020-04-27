let express = require('express')
let City = require('./city')
let cityType = new City()

let router = express.Router()
router.get('/v1/get/provinces', cityType.getProvinces)
router.get('/v1/get/cities', cityType.getCityByProvinces)
router.get('/v1/get/districts', cityType.getDistrictByCityCode)

module.exports = router