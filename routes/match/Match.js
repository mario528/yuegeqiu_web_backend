const {
    ErrorHandler,
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
        Promise.all([
            User.findOne({
                where: {
                    id: user_id
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
            match_address,
            longitude,
            latitude,
            team_id
        } = req.body
        if (!user_id || !match_name || !start_time || !end_time || max_team_number <= 0 || !match_address) {
            ErrorHandler.handleParamsError()
            return;
        }
        Promise.all([
            Match.create({
                creat_id: user_id,
                match_name: match_name,
                match_property: match_property,
                match_type: match_type,
                start_time: start_time,
                end_time: end_time,
                max_team_number: max_team_number,
                match_detail: match_detail,
                match_province: location_info.province,
                match_city: location_info.city,
                match_district: location_info.district,
                match_address: match_address,
                longitude: longitude,
                latitude: latitude
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
    async createChallenge (req, res) {
        let {
            user_id,
            team_id,
            time,
            longitude,
            latitude,
            type,
            detail,
            be_challenged_team_id,
            address
        } = req.body
        if (!user_id || !team_id || !time || !longitude || !latitude || !be_challenged_team_id) ErrorHandler.handleParamsError(res)
        Promise.all([
            Match.create({
                creat_id: user_id,
                match_name: '约球',
                match_property: 0,
                match_type: type,
                start_time: time,
                end_time: time,
                max_team_number: 2,
                match_detail: detail,
                match_court_location: address,
                is_challenge: 1,
                longitude: longitude,
                latitude: latitude
            }),
            Team.findOne({
                where: {
                    id: team_id
                }
            }),
            Team.findOne({
                where: {
                    id: be_challenged_team_id
                }
            })
        ]).then(async search_result => {
            let match = search_result[0], 
                invite_team = search_result[1],
                be_invite_team = search_result[2]
            await match.addMatchMember(invite_team)
            await match.addMatchMember(be_invite_team, {
                through: {
                    state: 1
                }
            })
            res.json({
                status: true
            })
            res.end()
        })
    }
}
module.exports = new MatchType()