let sequlize = require('sequelize')
let sequelizeInstance = require('../../Dao/dbConnect')
// 用户表
const User = sequelizeInstance.import('./userModel')
// 球队表
const Team = sequelizeInstance.import('./teamModel')
// 用户关系表
const FriendShip = sequelizeInstance.import('./friendShipModel')
// 球队成员表
const TeamMember = sequelizeInstance.import('./teamMemberModel')
// 球队活动表
const TeamActivity = sequelizeInstance.import('./teamActivityModel')
// 球队活动成员表
const TeamActivityMember = sequelizeInstance.import('./teamActivityMemberModel')
// 赛事表
const Match = sequelizeInstance.import('./matchModel')
// 赛事关系表
const MatchMember = sequelizeInstance.import('./matchMemberModel')
// 短信发送
const Sms = sequelizeInstance.import('./smsModel')
// 球队留言板
const TeamMessageBoard = sequelizeInstance.import('./teamMessageBoardModel')
// n : m
User.belongsToMany(Team, {
    through: TeamMember, 
    as: 'TeamMember',
    foreignKey: 'user_id',
    constraints: false
})
Team.belongsToMany(User, {
    through: TeamMember, 
    as: 'TeamMember',
    foreignKey: 'team_id',
    constraints: false
})

TeamMessageBoard.belongsTo(User, {
    foreignKey: 'user_id',
    target: 'id',
    as: 'user_info'
})
TeamMessageBoard.belongsTo(TeamMember, {
    foreignKey: 'user_id',
    target: 'user_id',
    as: 'team_role'
})


User.belongsToMany(TeamActivity, {
    through: TeamActivityMember, 
    as: 'TeamActivityMember',
    foreignKey: 'user_id',
    constraints: false
})
TeamActivity.belongsToMany(User, {
    through: TeamActivityMember, 
    foreignKey: 'activity_id',
    as: 'TeamActivityMember',
    constraints: false
})

User.belongsToMany(User, {
    through: FriendShip,
    as: 'FriendShip_sponsor',
    foreignKey: 'sponsor_id',
    constraints: false
})
User.belongsToMany(User, {
    through: FriendShip,
    as: 'FriendShip_befocused',
    foreignKey: 'befocused_id',
    constraints: false
})

Match.belongsToMany(Team, {
    through: MatchMember, 
    as: 'MatchMember',
    foreignKey: 'match_id',
    constraints: false
})
Team.belongsToMany(Match, {
    through: MatchMember, 
    as: 'MatchMember',
    foreignKey: 'team_id',
    constraints: false
})

sequelizeInstance.sync()

exports.User = User
exports.Team = Team
exports.FriendShip = FriendShip
exports.TeamMember = TeamMember
exports.TeamActivity = TeamActivity
exports.TeamActivityMember = TeamActivityMember
exports.Match = Match
exports.Sms = Sms
exports.TeamMessageBoard = TeamMessageBoard