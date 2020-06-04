module.exports = function (sequelize, DataTypes) {
    return sequelize.define('team_member', {
        id: {
            type: DataTypes.BIGINT(30),
            primaryKey: true,
            allowNull: true,
            unique: true,
            autoIncrement: true
        },
        role: {
            type: DataTypes.BIGINT(11),
            allowNull: false,
            defaultValue: 2,
            comment: '0: 队长 1: 副队长 2: 队员'
        },
        team_number: {
            type: DataTypes.BIGINT(11),
            allowNull: true,
        },
        team_position: {
            type: DataTypes.BIGINT(11),
            allowNull: true,
            comment: '0: 门将 1: 边后卫 2: 中后卫 3: 后腰 4：前腰 5: 边锋 6: 前锋 7: 教练'
        },
    }, {
        timestamps: false,
        tableName: 'team_member',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}