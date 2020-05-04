const {
    ErrorHandler,
    AccountUtils,
    Jwt,
    TimeFormat
} = require('../../utils/index')
const {
    User,
    Team,
    TeamMember
} = require('../../model/db/modules/index')
class TeamType {
    constructor () {}
    async getUserTeamInfo (req, res) {
        let { user_id } = req.query
        if (!user_id) ErrorHandler.handleParamsError(res)
        let decode_user_id = AccountUtils.decodeUserId(user_id)
        let search_result = await Team.findAll({
            attributes: { exclude: ['users'] },
            include: [
                {
                    model: User,
                    as: 'TeamMember',
                    where: {
                        id: decode_user_id
                    }
                }
            ]
        })
        search_result.forEach(item => {
            delete item.dataValues.users;
        })
        res.json({
            data: {
                team: search_result || []
            },
            status: true
        })
    }
    async createTeam (req, res) {
        let {
            team_name,
            location,
            team_description,
            team_activity_location_detail,
            user_id
        } = req.body
        let decode_user_id = AccountUtils.decodeUserId(user_id)
        Promise.all([
            Team.create({
                team_name: team_name,
                province: location.province,
                city: location.city,
                district: location.district,
                activity_position_detail: team_activity_location_detail,
                description: team_description
            }),
            User.findOne({
                where: {
                    id: decode_user_id
                }
            })
        ]).then(results => {
            
            var team = results[0];
            var user = results[1];
            team.addTeamMember(user)
            res.json({
                status: true,
                msg: '球队创建成功'
            })
            res.end()
        })
    }
}
module.exports = new TeamType()