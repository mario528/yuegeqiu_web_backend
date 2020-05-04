module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {
            type: DataTypes.BIGINT(11),
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        nick_name: DataTypes.STRING(255),
        telephone: DataTypes.STRING,
        password: DataTypes.STRING,
        salt: DataTypes.STRING,
        head_url: DataTypes.STRING,
        sex: DataTypes.BIGINT(10),
        province: DataTypes.STRING,
        city: DataTypes.STRING,
        district: DataTypes.STRING,
        channel: DataTypes.STRING
    }, {
        timestamps: true,
        tableName: 'user',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}