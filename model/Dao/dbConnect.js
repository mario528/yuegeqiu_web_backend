const Sequelize = require('sequelize')
const conf = require('../../conf/mysql/mysql')
let sequelizeInstance = new Sequelize(conf.database, conf.user, conf.password, {
    host: conf.host,
    dialect: conf.dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    ialectOptions: {
        useUTC: false //for reading from database
    },
    timezone: '+08:00'
})
module.exports = sequelizeInstance