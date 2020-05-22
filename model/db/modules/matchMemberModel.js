module.exports = function (sequelize, DataTypes) {
    return sequelize.define('match_member', {
        id: {
            type: DataTypes.BIGINT(30),
            primaryKey: true,
            allowNull: true,
            unique: true,
            autoIncrement: true
        }
    }, {
        timestamps: false,
        tableName: 'match_member',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}