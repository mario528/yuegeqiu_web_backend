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
const cache = require('../../model/Cache/cache')
const Op = require('sequelize').Op
class Home {
    constructor () {}
    async home (req, res) {
        let { 
            user_id
        } = req.body
        let decode_user_id, match_list
        if (user_id) {
            decode_user_id = AccountUtils.decodeUserId(user_id)
        }
        if (user_id) {
            let user_info = await User.findOne({
                where: {
                    id: decode_user_id
                }
            })
            match_list = await Match.findAll({
                where: {
                    match_city: user_info.city,
                    match_district: user_info.district
                },
                order: ['end_time'],
                attributes: { exclude: ['end_time', 'start_time'] },
                limit: 5
            })  
        }else {
            match_list = await Match.findAll({
                where: {
                    end_time: {
                        [Op.gte]: new TimeFormat().formateTime('YYYY-MM-DD')
                    }
                },
                order: ['end_time'],
                attributes: { exclude: ['end_time', 'start_time'] },
                limit: 5
            })  
        }
        let user_count = await User.findAndCountAll()
        let team_count = await Team.findAndCountAll()
        res.json({
            data: {
                project_detail: {
                    online_number: global.online_number,
                    user_count: user_count.count,
                    team_count: team_count.count
                },
                match_list: match_list,
                banner: [
                    {
                        url: 'https://yuegeqiu-mario.oss-cn-beijing.aliyuncs.com/banner_1.jpg'
                    },
                    {
                        url: 'https://yuegeqiu-mario.oss-cn-beijing.aliyuncs.com/banner_1.jpg'
                    }
                ],
                news_list: [
                    {
                        article_title: '惊！',
                        article_id: 0
                    },
                    {
                        article_title: '约个球',
                        article_id: 1
                    },
                    {
                        article_title: '加油',
                        article_id: 2
                    },
                    {
                        article_title: '我的妈呀',
                        article_id: 3
                    }
                ]
            },
            status: true
        }) 
        res.end()
    }
}
module.exports = new Home()