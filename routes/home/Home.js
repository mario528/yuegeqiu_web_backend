const {
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
        let match_list
        if (user_id) {
            let user_info = await User.findOne({
                where: {
                    id: user_id
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
                        url: 'https://yuegeqiu-mario.oss-cn-beijing.aliyuncs.com/banner_2.jpg'
                    }
                ],
                news_list: []
            },
            status: true
        }) 
        res.end()
    }
}
module.exports = new Home()