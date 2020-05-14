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
    TeamActivityMember
} = require('../../model/db/modules/index')
const Sequelize = require('sequelize');
class TeamType {
    constructor () {}
    static _getTeamActivity (team_id, start_at, end_at) {
        return new Promise((reslove, reject) => {
            TeamActivity.findAll({
                where: {
                    team_id: team_id
                }
            }).then((res) => {
                reslove(res)
            })
        })
    }
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
        let search_result_ismember;
        let decode_user_id = AccountUtils.decodeUserId(user_id)
        let search_result = await Team.findOne({
            include: [
                {
                    model: User,
                    as: 'TeamMember',
                    // where: {
                    //     id: decode_user_id
                    // },
                    attributes: ['nick_name', 'head_url', 'id'],
                }
            ],
            where: {
                id: team_id
            }
        })
        if (decode_user_id) {
            search_result_ismember = await TeamMember.findOne({
                where: {
                    team_id: team_id,
                    user_id: decode_user_id
                }
            }) 
        }
        let team_member = search_result.TeamMember
        delete search_result.dataValues.TeamMember
        team_member.forEach(item => {
            item.role = item.team_member.role
            delete item.dataValues.team_member
        })
        let start_at = new TimeFormat().getMondayBeforeToady()
        let end_at = new TimeFormat().getSundayAfterDay(15)
        let calendar_list_activity = await TeamType._getTeamActivity(team_id, start_at, end_at)
        let calendar_list = new TimeFormat().generateTimeCalendar(start_at, end_at)
        calendar_list.forEach(item => {
            calendar_list_activity.forEach((activity_item) => {
                if (!item.activity_id) {
                    let time_str = new TimeFormat(activity_item.activity_time).formateTime('YYYY-MM-DD')
                    item.activity = item.date == time_str ? activity_item.activity_title : null
                    item.activity_id = item.date == time_str ? activity_item.id : null
                }
            })
        })
        res.json({
            status: true,
            data: {
                team_info: search_result,
                team_member: team_member,
                calendar: {
                    start_at: start_at,
                    end_at: end_at,
                    calendar_list: calendar_list || []
                },
                is_member: user_id && search_result_ismember && search_result_ismember.length != 0
            }
        })
        res.end()
    }
    async updateTeamInform (req, res) {
        let {   
            user_id,
            team_id,
            inform_detail
        } = req.body
        if (!user_id || !team_id || !inform_detail) ErrorHandler.handleParamsError(res)
        await Team.update({
            team_inform: inform_detail
        },{
            where: {
                id: team_id
            }
        })
        res.json({
            status: true,
            msg: '修改成功'
        })
        res.end()
    }
    async createTeamActivity (req, res) {
        let {
            team_id,
            user_id,
            activity_title,
            activity_date,
            activity_time,
            activity_detail
        } = req.body
        if (!team_id || !user_id || !activity_title || !activity_date || !activity_time) ErrorHandler.handleParamsError(res)
        let decode_user_id = AccountUtils.decodeUserId(user_id)
        Promise.all([
            TeamActivity.create({
                team_id: Number(team_id),
                activity_time: activity_date,
                activity_hour: activity_time,
                activity_title: activity_title,
                activity_detail: activity_detail
            }),
            User.findOne({
                where: {
                    id: decode_user_id
                }
            })
        ]).then(results => {
            var teamActivity = results[0];
            var user = results[1];
            teamActivity.addTeamActivityMember(user)
            res.json({
                data: {},
                status: true,
                msg: '活动创建成功'
            })
            res.end()
        })
    }
    async getActivityRole (req, res) {
        let {
            team_id,
            user_id,
            activity_id
        } = req.body
        if (!team_id || !user_id || !activity_id) ErrorHandler.handleParamsError(res)
        let decode_user_id = AccountUtils.decodeUserId(user_id)
        let join_state = -1
        let search_result = await TeamActivity.findOne({
            include: [
                {
                    model: User,
                    as: 'TeamActivityMember',
                    where: {
                        id: decode_user_id
                    }
                }
            ],
            where: {
                id: activity_id,
                team_id: team_id
            }
        })
        if (search_result) {
            if (search_result.TeamActivityMember[0].id == decode_user_id) join_state = 1
            else join_state = 2
        }
        res.json({
            data: {
                join_state: join_state
            },
            status: true
        })
        res.end()
    }
    async findTeam (req, res) {
        let {
            team_name,
            province,
            city,
            district
        } = req.body
        const Op = Sequelize.Op
        let search_query_by_teamname = {
            team_name: {
                [Op.like]:'%' + team_name + '%'
            }
        }
        let search_query_by_location = {
            province: province,
            city: city,
            district: district
        }
        let search_query = team_name ? search_query_by_teamname : search_query_by_location
        let search_result = await Team.findAll({
            raw: true,
            attributes: ['id','team_name','team_icon','district', 'description'],
            where: search_query
        })
        res.json({
            data: search_result,
            status: true
        })
        res.end()
    }
    async joinTeam (req, res) {
        let {
            user_id,
            team_id
        } = req.body
        if ( !user_id || !team_id ) ErrorHandler.handleParamsError(res)
        let decode_user_id = AccountUtils.decodeUserId(user_id)
        Promise.all([
            Team.findOne({
                where: {
                    id: team_id
                }
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
                msg: '球队加入成功'
            })
            res.end()
        })

    }
    async departTeam (req, res) {
        let {
            user_id,
            team_id
        } = req.body
        if ( !user_id || !team_id ) ErrorHandler.handleParamsError(res)
        let decode_user_id = AccountUtils.decodeUserId(user_id)
        Promise.all([
            Team.findOne({
                where: {
                    id: team_id
                }
            }),
            User.findOne({
                where: {
                    id: decode_user_id
                }
            })
        ]).then(results => {
            var team = results[0];
            var user = results[1];
            team.removeTeamMember(user)
            res.json({
                status: true,
                msg: '离队成功'
            })
            res.end()
        })
    }
}
module.exports = new TeamType()