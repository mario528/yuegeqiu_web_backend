module.exports = function (sequlize, DataTypes) {
    return sequlize.define('team_activity', {
        id: {
            type: DataTypes.BIGINT(30),
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        team_id: {
            type: DataTypes.BIGINT(30),
            allowNull: false
        },
        activity_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        activity_hour: {
            type: DataTypes.STRING,
            allowNull: false
        },
        activity_title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        activity_detail: DataTypes.TEXT
    }, {
        timestamps: false,
        tableName: 'team_activity',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}