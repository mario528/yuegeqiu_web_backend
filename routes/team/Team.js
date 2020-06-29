const mongoose = require('mongoose')
const {
    ErrorHandler,
    Jwt,
    TimeFormat,
    AccountUtils
} = require('../../utils/index')
const {
    User,
    Team,
    TeamMember,
    TeamActivity,
    Match,
    TeamMessageBoard
} = require('../../model/db/modules/index')
let sequelizeInstance = require('../../model/Dao/dbConnect')
const sequelize = require('sequelize');
const Op = sequelize.Op
// const { team_formation_setting } = require('../../conf/baseConf/index')
class TeamType {
    constructor() {}
    static _getTeamActivity(team_id, start_at, end_at) {
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
    async getUserTeamInfo(req, res) {
        let {
            user_id
        } = req.query
        if (!user_id) ErrorHandler.handleParamsError(res)
        let search_result = await Team.findAll({
            attributes: {
                exclude: ['users']
            },
            include: [{
                model: User,
                as: 'TeamMember',
                where: {
                    id: user_id
                }
            }]
        })

        let start_at = new TimeFormat().formateTime('YYYY-MM-DD')
        let end = new TimeFormat().getNextTimesDay(start_at, 6)
        let end_at = new TimeFormat(end).formateTime('YYYY-MM-DD')
        let calendar_list = new TimeFormat().generateTimeCalendar(start_at, end_at)

        search_result.forEach(item => {
            delete item.dataValues.TeamMember;
        })
        res.json({
            data: {
                team: search_result || [],
                calendar: {
                    calendar_list: calendar_list,
                    today_week: new Date(start_at).getDay()
                }
            },
            status: true
        })
    }
    async createTeam(req, res) {
        let {
            team_name,
            location,
            team_description,
            team_activity_location_detail,
            home_court_color,
            away_court_color,
            longitude,
            latitude,
            user_id
        } = req.body
        Promise.all([
            Team.create({
                team_name: team_name,
                province: location.province,
                city: location.city,
                district: location.district,
                activity_position_detail: team_activity_location_detail,
                description: team_description,
                home_court_color: home_court_color,
                away_court_color: away_court_color,
                longitude: longitude,
                latitude: latitude
            }),
            User.findOne({
                where: {
                    id: user_id
                }
            })
        ]).then(async results => {
            var team = results[0];
            var user = results[1];
            await team.addTeamMember(user, {
                through: {
                    role: 0
                }
            })
            // 暂时不考虑性能的情况下 在用户注册后 直接推送 但用户量大后 会引发前端性能问题
            await global.$socket.broadcast.emit('addTeam', {
                team_number: team.id
            })
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
    async getTeamDetail(req, res) {
        let {
            user_id,
            team_id
        } = req.body
        let search_result_ismember;
        let search_result = await Team.findOne({
            include: [{
                model: User,
                as: 'TeamMember',
                attributes: ['nick_name', 'head_url', 'id'],
            }],
            where: {
                id: team_id
            }
        })
        if (user_id) {
            search_result_ismember = await TeamMember.findOne({
                where: {
                    team_id: team_id,
                    user_id: user_id
                }
            })
        }
        let team_member = search_result.TeamMember
        delete search_result.dataValues.TeamMember
        team_member = team_member.map(item => {
            return {
                head_url: item.head_url + '?' + new Date().valueOf(),
                id: item.id,
                role: item.team_member.role,
                nick_name: item.nick_name,
                team_number: item.team_member.team_number || null,
                team_position: item.team_member.team_position || null
            }
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
        let match_list = await search_result.getMatchMember()
        let team_role = user_id == null ? null : await TeamMember.findOne({
            where: {
                team_id: team_id,
                user_id: user_id
            }
        })
        res.json({
            status: true,
            data: {
                team_info: search_result,
                team_member: team_member,
                team_role: team_role ? team_role.role : false,
                calendar: {
                    start_at: start_at,
                    end_at: end_at,
                    calendar_list: calendar_list || []
                },
                is_member: user_id && search_result_ismember && search_result_ismember.length != 0,
                match_list: match_list.map(item => {
                    return {
                        id: item.id,
                        match_name: item.match_name,
                        match_property: item.match_property,
                        match_type: item.match_type,
                        start_time: item.start_time,
                        end_time: item.end_time,
                        max_team_number: item.max_team_number,
                        match_detail: item.match_detail,
                        match_location: {
                            province: item.match_province,
                            city: item.match_city,
                            district: item.match_district
                        }
                    }
                })
            }
        })
        res.end()
    }
    async updateTeamInform(req, res) {
        let {
            user_id,
            team_id,
            inform_detail
        } = req.body
        if (!user_id || !team_id) ErrorHandler.handleParamsError(res)
        await Team.update({
            team_inform: inform_detail
        }, {
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
    async createTeamActivity(req, res) {
        let {
            team_id,
            user_id,
            activity_title,
            activity_date,
            activity_time,
            activity_detail
        } = req.body
        if (!team_id || !user_id || !activity_title || !activity_date || !activity_time) ErrorHandler.handleParamsError(res)
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
                    id: user_id
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
    async getActivityRole(req, res) {
        let {
            team_id,
            user_id,
            activity_id
        } = req.body
        if (!team_id || !user_id || !activity_id) ErrorHandler.handleParamsError(res)
        let join_state = -1
        let search_result = await TeamActivity.findOne({
            include: [{
                model: User,
                as: 'TeamActivityMember',
                where: {
                    id: user_id
                }
            }],
            where: {
                id: activity_id,
                team_id: team_id
            }
        })
        if (search_result) {
            if (search_result.TeamActivityMember[0].id == user_id) join_state = 1
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
    async findTeam(req, res) {
        let {
            team_name,
            province,
            city,
            district
        } = req.body
        let search_query_by_teamname = {
            team_name: {
                [Op.like]: '%' + team_name + '%'
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
            attributes: ['id', 'team_name', 'team_icon', 'district', 'description'],
            where: search_query
        })
        res.json({
            data: search_result,
            status: true
        })
        res.end()
    }
    async joinTeam(req, res) {
        let {
            user_id,
            team_id
        } = req.body
        if (!user_id || !team_id) ErrorHandler.handleParamsError(res)
        Promise.all([
            Team.findOne({
                where: {
                    id: team_id
                }
            }),
            User.findOne({
                where: {
                    id: user_id
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
    async departTeam(req, res) {
        let {
            user_id,
            team_id
        } = req.body
        if (!user_id || !team_id) ErrorHandler.handleParamsError(res)
        Promise.all([
            Team.findOne({
                where: {
                    id: team_id
                }
            }),
            User.findOne({
                where: {
                    id: user_id
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
    async teamSuggest(req, res) {
        let {
            user_id
        } = req.query
        let user_location_info, suggest_team;
        if (user_id) {
            user_location_info = await User.findOne({
                attributes: ['province', 'city', 'district'],
                where: {
                    id: user_id,
                }
            })
        }
        suggest_team = await Team.findAll({
            attributes: ['id', 'team_name', 'team_icon', 'description'],
            where: {
                district: (user_location_info && user_location_info.district) || '朝阳区'
            },
            limit: 5
        })
        res.json({
            data: {
                suggest_team_list: suggest_team
            },
            status: true
        })
        res.end()

    }
    async getTeamPageDetail(req, res) {
        let {
            user_id
        } = req.body
        let team_list = [],
            hot_match_list = [];
        if (user_id) {
            team_list = await Team.findAll({
                attributes: {
                    exclude: ['users']
                },
                include: [{
                    model: User,
                    as: 'TeamMember',
                    where: {
                        id: user_id
                    }
                }]
            })
        }
        hot_match_list = await Match.findAll({
            limit: 5,
            attributes: {
                exclude: ['end_time', 'start_time', 'creat_id']
            },
            where: {
                start_time: {
                    [Op.gt]: new TimeFormat().formateTime('YYYY-MM-DD')
                }
            },
            order: [
                [
                    'id',
                    'DESC'
                ]
            ]
        })
        res.json({
            data: {
                hot_match_list: hot_match_list,
                is_login: user_id != null,
                join_team_list: team_list,
            },
            status: true
        })
        res.end()
    }
    async teamMap(req, res) {
        let {
            city
        } = req.query
        if (!city) ErrorHandler.handleParamsError(res)
        let team_list = await Team.findAll({
            attributes: ['id', 'team_name', 'team_icon', 'description', 'longitude', 'latitude'],
            where: {
                city: city
            }
        })
        res.json({
            data: {
                team_list: team_list
            },
            status: true
        })
        res.end()
    }
    async switchTeamMemberNumber(req, res) {
        let {
            user_id,
            team_number,
            team_id
        } = req.query
        if (!user_id || !team_number || !team_id) ErrorHandler.handleParamsError(res)
        await TeamMember.update({
            team_number: team_number
        }, {
            where: {
                user_id: user_id
            }
        })
        res.json({
            data: {},
            status: true
        })
    }
    async switchTeamMemberPosition(req, res) {
        let {
            user_id,
            team_position,
            team_id
        } = req.query
        if (!user_id || !team_position || !team_id) ErrorHandler.handleParamsError(res)
        await TeamMember.update({
            team_position: team_position
        }, {
            where: {
                user_id: user_id
            }
        })
        res.json({
            data: {},
            status: true
        })
    }
    async getTeamChat (req,res) {
        let {
            user_id,
            team_id
        } = req.body
        if (!team_id) ErrorHandler.handleParamsError(res)
        // 查询 mongodb 
        const TeamChat = mongoose.model('TeamChat')
        let result = await TeamChat.find({
            team_id: team_id
        }, 'date content publish_id team_id publish_icon_url publish_nick_name').limit(20)
        result = result.map(item => {
            delete item._doc._id
            return {
                ...item._doc,
                is_self: item.publish_id == user_id
            }
        })
        res.json({
            data: {
                message_list: result
            },
            status: true
        })
    }
    async sendTeamChat (req, res) {
        let {
            user_id,
            team_id,
            content
        } = req.body
        if (!user_id || !team_id) ErrorHandler.handleParamsError(res)
        // 查询 mongodb 
        const TeamChat = mongoose.model('TeamChat')
        let { head_url, nick_name } = await User.findOne({
            id: user_id
        })
        const chat = new TeamChat({
            publish_id: user_id,
            team_id: team_id,
            content: content,
            publish_icon_url: head_url,
            publish_nick_name: nick_name
        })
        chat.save(async (err, success_res) => {
            if (err) {
                res.json({
                    msg: '发送失败',
                    status: false
                })
                res.end()
            }else {
                global.$socket_io.sockets.in(`teamId${team_id}`).emit('receiveMsg', {
                    publish_id: user_id,
                    team_id: team_id,
                    content: content,
                    publish_icon_url: head_url,
                    publish_nick_name: nick_name,
                    publish_id_encode: AccountUtils.cryptoUserId(user_id),
                })
                res.json({
                    msg: '发送成功',
                    status: true
                })
                res.end()
            }
        })
    }
    async getTeamMessageBoard (req, res) {
        const PAGE_SIZE = 5;
        let data_list = []
        let { 
            team_id,
            user_id,
            sort_type,
            page
        } = req.body
        if (!team_id || page == -1) ErrorHandler.handleParamsError(res)
        // 一个成员在球队留言板可发送n条
        // 每个球队可以有n个留言
        const offset = PAGE_SIZE * page
        let team_message_board = await TeamMessageBoard.findAndCountAll({
            rows: true,
            where: {
                team_id: team_id
            },
            offset,
            limit: PAGE_SIZE,
            include: [
                {
                    model: User,
                    as: 'user_info',
                    attributes: ['nick_name', 'head_url']
                },
                {
                    model: TeamMember,
                    as: 'team_role',
                    attributes: ['role']
                }
            ]
        })
        if ( user_id ) {
            data_list = team_message_board.rows.map(item => {
                item.is_self = +user_id == item.user_id
                return item
            })
        }
        res.json({
            status: true,
            data: {
                message_board_info: {
                    list: data_list,
                    count: team_message_board.count,
                }
            }
        })
        res.end()
    }
    async sendTeamMessageBoard (req, res) {
        let {
            team_id,
            user_id,
            content
        } = req.body
        if (!team_id || !content || !user_id) ErrorHandler.handleParamsError(res)
        let is_join = await TeamMember.findOne({
            where: {
                team_id: team_id,
                user_id: user_id
            }
        })
        if (is_join) {
            await TeamMessageBoard.create({
                team_id: team_id,
                user_id: user_id,
                content: content,
                publish_date: new TimeFormat().formateTime('YYYY-MM-DD HH:MM:SS'),
            })
            res.json({
                status: true
            })
            res.end()
        }else {
            res.json({
                status: false,
                msg: '发布留言需加入球队'
            })
            res.end()
        }
        
    }
    async getUserTeamList (req, res) {
        let {
            user_id,
        } = req.query
        if (!user_id) ErrorHandler.handleParamsError(res)
        let query_string = `SELECT t.id, team_name, team_icon FROM team as t
        INNER JOIN team_member as tm
        ON tm.user_id = ${user_id} AND tm.team_id = t.id AND tm.role <> 2;`
        // TODO 问题： 应忽略中间表
        let team_list = await sequelizeInstance.query(query_string)
        res.json({
            status: true,
            data: {
                team_list: team_list[0]
            }
        })
        res.end()
    }
    async getTeamFormationInfo (req, res) {
        let {
            user_id,
            team_id
        } = req.body
        let team_info = await Team.findOne({
            where: {
                id: team_id
            }
        })
        let query_string = `SELECT user.id, user.nick_name, user.head_url,role FROM team_member 
        INNER JOIN user ON
        user.id = team_member.user_id
        AND
        team_member.team_id = ${team_id}`
        let team_list = await sequelizeInstance.query(query_string)
        let is_member = false
        if (user_id) {
            is_member = await TeamMember.findOne({
                where: {
                    team_id: team_id,
                    user_id: user_id
                }
            }).length != 0
        }
        res.json({
            data: {
                team_info: team_info,
                team_list: team_list[0],
                is_member: is_member,
                team_formation_setting: require('../../conf/baseConf/index').team_formation_setting
            },
            status: true
        })
        res.end()
    }
}
module.exports = new TeamType()