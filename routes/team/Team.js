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
            delete item.dataValues.TeamMember;
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
            home_court_color,
            away_court_color,
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
                description: team_description,
                home_court_color: home_court_color,
                away_court_color: away_court_color
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
                data: {
                    team_id: team.id
                },
                status: true,
                msg: '球队创建成功'
            })
            res.end()
        })
    }
    async getTeamDetail (req, res) {
        let {
            user_id,
            team_id
        } = req.body
        let decode_user_id = AccountUtils.decodeUserId(user_id)
        let search_result = await Team.findOne({
            include: [
                {
                    model: User,
                    as: 'TeamMember',
                    where: {
                        id: decode_user_id
                    },
                    attributes: ['nick_name', 'head_url', 'id'],
                }
            ],
            where: {
                id: team_id
            }
        })
        let team_member = search_result.TeamMember
        delete search_result.dataValues.TeamMember
        team_member.forEach(item => {
            item.role = item.team_member.role
            delete item.dataValues.team_member
        })
        res.json({
            status: true,
            data: {
                team_info: search_result,
                team_member: team_member,
                caleder: {
                    start_at: TimeFormat.getMondayBeforeToady(),
                    end_at: TimeFormat.getSundayAfterDay(30),
                    caleder_list: []
                }
            }
        })
        res.end()
    }
}
module.exports = new TeamType()