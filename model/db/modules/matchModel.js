const { TimeFormat } = require('../../../utils/index')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('match', {
        id: {
            type: DataTypes.BIGINT(30),
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        creat_id: {
            type: DataTypes.BIGINT(30),
            allowNull: false
        },
        match_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        match_property: {
            type: DataTypes.BIGINT(11),
            allowNull: false,
            defaultValue: 0,
            comment: '0: 友谊赛 1: 正式比赛',
        },
        match_type: {
            type: DataTypes.BIGINT(11),
            allowNull: false,
            defaultValue: 2,
            comment: '0: 五人制 1: 七人制 2: 十一人制',
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        longitude: {
            type: DataTypes.DOUBLE(10,6),
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DOUBLE(10,6),
            allowNull: false,
        },
        max_team_number: {
            type: DataTypes.BIGINT(30),
            allowNull: true,
        },
        match_detail: {
            type: DataTypes.TEXT
        },
        match_court_location: {
            type: DataTypes.STRING
        },
        match_province: DataTypes.STRING,
        match_city: DataTypes.STRING,
        match_district: DataTypes.STRING,
        is_challenge: {
            type: DataTypes.BIGINT(11),
            defaultValue: 0,
            comment: '0: 普通赛事 1: 约个球',
        }
    }, {
        timestamps: false,
        tableName: 'match',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}