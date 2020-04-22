const Sequelize = require('Sequelize')
const conf = require('../../conf/mysql/mysql')
let sequelizeInstance = new Sequelize(conf.database, conf.user, conf.password, {
    host: conf.host,
    dialect: conf.dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})
module.exports = sequelizeInstance