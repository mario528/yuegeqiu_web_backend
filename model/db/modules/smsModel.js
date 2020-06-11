module.exports = function (sequelize, DataTypes) {
    return sequelize.define('sms', {
        id: {
            type: DataTypes.BIGINT(30),
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        telephone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sms_content: DataTypes.TEXT,
        send_datetime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        expire_time: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'sms',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}