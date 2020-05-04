let sequelizeInstance = require('../../Dao/dbConnect')
const User = sequelizeInstance.import('./userModel')
const Team = sequelizeInstance.import('./teamModel')
const FriendShip = sequelizeInstance.import('./teamMemberModel')
const TeamMember = sequelizeInstance.import('./teamMemberModel')
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
sequelizeInstance.sync()

exports.User = User
exports.Team = Team
exports.FriendShip = FriendShip
exports.TeamMember = TeamMember