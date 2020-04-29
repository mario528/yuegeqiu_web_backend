const { Sequelize } = require('sequelize')
let sequelizeInstance = require('../../Dao/dbConnect')

let teamMemberModel = sequelizeInstance.define('team_member', {
    id: {
        type: Sequelize.BIGINT(30),
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    team_id: {
        type: Sequelize.BIGINT(30),
        allowNull: false,
    },
    user_id: {
        type: Sequelize.BIGINT(11),
        allowNull: false
    }
},{
    timestamps: false,
    tableName: 'team_member',
    charset: 'utf8mb4', 
    collate: 'utf8mb4_general_ci',
    underscored: true
})
module.exports = teamMemberModel