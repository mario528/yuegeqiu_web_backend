const CityCode = require('../../utils/cityLocation')

class City {
    constructor () {}
    getProvinces (req, res) {
        let data = new CityCode().getProvinces()
        res.json({
            status: true,
            data: {
                provinces: data
            }
        })
        res.end()
    }
    getCityByProvinces (req, res) {
        let code = req.query.code
        let data = new CityCode().getCityByProvinces(code)
        res.json({
            status: true,
            data: {
                cities: data
            }
        })
        res.end()
    }
    getDistrictByCityCode (req, res) {
        let code = req.query.code
        let data = new CityCode().getDistrictByCityCode(code)
        res.json({
            status: true,
            data: {
                districtes: data
            }
        })
        res.end()
    }
}
module.exports = City