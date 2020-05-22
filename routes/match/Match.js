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
    constructor () {}

    getTime (req, res) {
        res.json({
            data: {
                today: new TimeFormat().formateTime('YYYY-MM-DD')
            },
            status: true
        })
        res.end()
    }

    createMatch (req, res) {
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
        if ( !user_id || !match_name || !start_time || !end_time || max_team_number <= 0 ) {
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
            })
        ]).then(search_result => {
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