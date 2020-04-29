const { Sequelize } = require('sequelize')
let sequelizeInstance = require('../../Dao/dbConnect')
let friendShipModel = sequelizeInstance.define()

module.exports = friendShipModel