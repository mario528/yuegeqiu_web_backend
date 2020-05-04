module.exports = function (sequelize, DataTypes) {
    return sequelize.define('team_member', {
        id: {
            type: DataTypes.BIGINT(30),
            primaryKey: true,
            allowNull: true,
            unique: true,
            autoIncrement: true
        },
        team_id: {
            type: DataTypes.BIGINT(30),
            allowNull: false,
        },
        user_id: {
            type: DataTypes.BIGINT(11),
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'team_member',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}