const { Sequelize } = require('sequelize')
let sequelizeInstance = require('../../Dao/dbConnect')

let user = sequelizeInstance.define('user', {
    id: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    nick_name: Sequelize.STRING(255),
    telephone: Sequelize.STRING(100),
    password: Sequelize.STRING(100),
    salt: Sequelize.STRING(100),
    head_url: Sequelize.STRING(255),
    sex: Sequelize.BIGINT(10),
    province: Sequelize.STRING(255),
    city: Sequelize.STRING(255),
    district: Sequelize.STRING(255),
    channel: Sequelize.STRING(100),
    create_at:  {
        type: Sequelize.DATE,
        allowNull: false
    },
    update_at: Sequelize.DATE
},{ 
    timestamps: false,
    tableName: 'user',
    charset: 'utf8mb4', 
    collate: 'utf8mb4_general_ci',
    underscored: true
})

module.exports = user