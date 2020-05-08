module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Team', {
        id: {
            type: DataTypes.BIGINT(30),
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        team_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        team_icon: {
            type: DataTypes.STRING,
            defaultValue: 'https://yuegeqiu-mario.oss-cn-beijing.aliyuncs.com/default_team_icon.png'
        },
        province: DataTypes.STRING,
        city: DataTypes.STRING,
        district: DataTypes.STRING,
        activity_position_detail: DataTypes.TEXT,
        description: DataTypes.TEXT,
        home_court_color: DataTypes.STRING,
        away_court_color: DataTypes.STRING,
        team_inform: DataTypes.TEXT
    }, {
        timestamps: false,
        tableName: 'team',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}