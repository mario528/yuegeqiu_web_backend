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
        }
    }, {
        timestamps: false,
        tableName: 'team_member',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}