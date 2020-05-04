const {
    User,
    friendShip,
    Team,
    teamMember
} = require('../modules/index')
User.belongsToMany(Team, {through: teamMember, as: 'TeamMember'})
Team.belongsToMany(User, {through: teamMember, as: 'TeamMember'})
console.log(User.setTeamMember, "++++++++++++++++++")