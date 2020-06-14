module.exports = function (sequelize, DataTypes) {
    return sequelize.define('team_message_board', {
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
        user_id: {
            type: DataTypes.BIGINT(30),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        publish_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        reply_id: {
            type: DataTypes.BIGINT(30),
            allowNull: true,
        }
    }, {
        timestamps: false,
        tableName: 'team_message_board',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}