module.exports = function (sequlize, DataTypes) {
    return sequlize.define('team_activity', {
        id: {
            type: DataTypes.BIGINT(30),
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        activity_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        activity_content: DataTypes.TEXT
    }, {
        timestamps: false,
        tableName: 'team_activity',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}