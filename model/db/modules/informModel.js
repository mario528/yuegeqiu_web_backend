module.exports = function (sequelize, DataTypes) {
    return sequelize.define('inform', {
        id: {
            type: DataTypes.BIGINT(30),
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        inform_type: {
            type: DataTypes.BIGINT(30),
            allowNull: false,
            comment: '0: 入队申请 1: 比赛挑战 2: 发起球队活动',
        },
        inform_content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        publist_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        expire_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        is_read: {
            type: DataTypes.BIGINT(5),
            defaultValue: 0,
            comment: '0: 未读 1: 已读',
        }
    }, {
        timestamps: false,
        tableName: 'inform',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}