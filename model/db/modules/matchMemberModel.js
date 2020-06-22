module.exports = function (sequelize, DataTypes) {
    return sequelize.define('match_member', {
        id: {
            type: DataTypes.BIGINT(30),
            primaryKey: true,
            allowNull: true,
            unique: true,
            autoIncrement: true
        },
        state: {
            type: DataTypes.BIGINT(30),
            defaultValue: 0,
            comment: '0: 待确认 1: 确认'
        }
    }, {
        timestamps: false,
        tableName: 'match_member',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}