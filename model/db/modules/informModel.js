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
        match_id: {
            type: DataTypes.BIGINT(30),
            comment: '比赛挑战关联比赛id',
        },
        activity_id: {
            type: DataTypes.BIGINT(30),
            comment: '活动 关联活动id',
        }
    }, {
        timestamps: false,
        tableName: 'inform',
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        underscored: true
    })
}