module.exports = function (sequelize, DataTypes) {
    return sequelize.define('inform_member', {
        id: {
            type: DataTypes.BIGINT(30),
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        inform_id: {
            type: DataTypes.BIGINT(30),
            allowNull: false
        },
        inform_user_id: {
            type: DataTypes.BIGINT(30),
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'inform_member',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}