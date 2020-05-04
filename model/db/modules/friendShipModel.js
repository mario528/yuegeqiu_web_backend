module.exports = function (sequelize, DataTypes) {
    return sequelize.define('friend_ship', {
        id: {
            type: DataTypes.BIGINT(30),
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        sponsor_id: {
            type: DataTypes.BIGINT(30),
            allowNull: false
        },
        befocused_id: {
            type: DataTypes.BIGINT(30),
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'friend_ship',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}