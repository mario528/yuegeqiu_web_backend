const { Sequelize } = require('sequelize')
let sequelizeInstance = require('../../Dao/dbConnect')

let teamModel = sequelizeInstance.define('team', {
    id: {
        type: Sequelize.BIGINT(30),
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    team_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    team_icon: Sequelize.STRING(255),
    province: Sequelize.STRING(255),
    city: Sequelize.STRING(255),
    district: Sequelize.STRING(255),
    description: Sequelize.STRING(500)
},{
    timestamps: false,
    tableName: 'team',
    charset: 'utf8mb4', 
    collate: 'utf8mb4_general_ci',
    underscored: true
})
module.exports = teamModel