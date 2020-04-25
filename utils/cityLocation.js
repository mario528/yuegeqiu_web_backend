const cityData = require('../public/cityJson/china_address')
class City {
    constructor () {
        this.cityData = cityData
    }
    getProvinces () {
        let arr = []
        this.cityData.forEach(item => {
            if (!item.parent) {
                arr.push(item)
            }
        })
        return arr
    }
    getCityByProvinces (provinces_code) {
        let arr = []
        this.cityData.forEach(item => {
            if (item.parent == provinces_code) {
                arr.push(item)
            }
        })
        return arr
    }
    getDistrictByCityCode (city_code) {
        let arr = []
        this.cityData.forEach(item => {
            if (item.parent == city_code) {
                arr.push(item)
            }
        })
        return arr
    } 
}
module.exports = City