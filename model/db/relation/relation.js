const {
    UserModel,
    friendShipModel,
    teamModel,
    teamMemberModel
} = require('../modules/index')
teamMemberModel.belongsTo(teamModel)