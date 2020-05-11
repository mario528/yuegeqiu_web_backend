module.exports = function (sequlize, DataTypes) {
    return sequlize.define('team_activity_member', {
        id: {
            type: DataTypes.BIGINT(30),
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        team_id: {
            type: DataTypes.BIGINT(30)
        }
    }, {
        timestamps: false,
        tableName: 'team_activity_member',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}