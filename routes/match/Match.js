const {
    ErrorHandler,
    AccountUtils,
    Jwt,
    TimeFormat
} = require('../../utils/index')
const {
    User,
    Team,
    TeamMember,
    TeamActivity,
    TeamActivityMember,
    Match
} = require('../../model/db/modules/index')
class MatchType {
    constructor() {}
    async getCreateMatchDetail(req, res) {
        let {
            user_id
        } = req.query
        if (!user_id) {
            ErrorHandler.handleParamsError()
            return;
        }
        let decode_user_id = AccountUtils.decodeUserId(user_id)
        Promise.all([
            User.findOne({
                where: {
                    id: decode_user_id
                }
            })
        ]).then(async search_result => {
            let user = search_result[0]
            let team_list = await user.getTeamMember({
                attributes: ['team_icon', 'team_name', 'id']
            })            
            res.json({
                data: {
                    join_team_list: team_list.map(item => {
                        return {
                            team_icon: item.team_icon,
                            team_name: item.team_name,
                            id: item.id
                        }
                    }),
                    today: new TimeFormat().formateTime('YYYY-MM-DD')
                },
                status: true
            })
            res.end()
        })
    }
    async createMatch(req, res) {
        let {
            user_id,
            match_name,
            start_time,
            end_time,
            max_team_number,
            location_info,
            match_detail,
            match_type,
            match_property,
            team_id
        } = req.body
        if (!user_id || !match_name || !start_time || !end_time || max_team_number <= 0) {
            ErrorHandler.handleParamsError()
            return;
        }
        let decode_user_id = AccountUtils.decodeUserId(user_id)
        Promise.all([
            Match.create({
                creat_id: decode_user_id,
                match_name: match_name,
                match_property: match_property,
                match_type: match_type,
                start_time: start_time,
                end_time: end_time,
                max_team_number: max_team_number,
                match_detail: match_detail,
                match_province: location_info.province,
                match_city: location_info.city,
                match_district: location_info.district
            }),
            Team.findOne({
                where: {
                    id: team_id
                }
            })
        ]).then(search_result => {
            let match = search_result[0], team
            if (team_id) {
                team = search_result[1]
                match.addMatchMember(team)
            }
            res.json({
                data: {},
                status: true,
                msg: '赛事创建成功'
            })
            res.end()
        })
    }
}
module.exports = new MatchType()