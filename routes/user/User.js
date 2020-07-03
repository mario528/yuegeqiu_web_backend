const {
    ErrorHandler,
    AccountUtils,
    Jwt,
    SmsType,
    TimeFormat
} = require('../../utils/index')
const {
    User,
    FriendShip,
    Inform,
    InformMember
} = require('../../model/db/modules/index')
const sms_conf = require('../../conf/sms/sms')
const redisDao = require('../../model/redis/redis')
let sequelizeInstance = require('../../model/Dao/dbConnect')
class UserType {
    constructor() {}
    static _testTokenState (token) {
        return new Promise((reslove, reject) => {
            if (!token) reject(false)
            let tokenAvailable = new Jwt().verifyTokenAvailable(token)
            if (!tokenAvailable.state) reject(false)
            else reslove(true)
        })
    }
    static async _checkVerificationCodeState (telephone, verification_code) {
        telephone = "+86" + telephone
        const redis_verification_code = await redisDao.getValue(telephone)
        if (!redis_verification_code || redis_verification_code != verification_code) return false
        else return true
    }
    async login(req, res) {
        let {
            telephone,
            password
        } = req.body
        if (!telephone || !password) {
            ErrorHandler.handleParamsError(res)
            return
        }
        let searchResult = await User.findOne({
            where: {
                telephone: telephone
            }
        })
        if (!searchResult) {
            ErrorHandler.handleParamsError(res, '该手机号未注册')
            return
        }
        let accountInfo = searchResult.dataValues
        if (accountInfo.password != AccountUtils.cryptoPassWord(password, accountInfo.salt).crypto_password) {
            ErrorHandler.handleParamsError(res, '密码输入有误')
            return
        }
        let token = new Jwt(accountInfo.id).createToken()
        let encode_id = AccountUtils.cryptoUserId(accountInfo.id)
        res.json({
            status: true,
            data: {
                user_id: encode_id,
                token: token
            }
        })
        res.end()
    }
    async register(req, res) {
        let {
            telephone,
            password,
            verification_code,
            channel
        } = req.body
        if (!telephone || !password || !verification_code) {
            ErrorHandler.handleParamsError(res)
            return
        }
        if (!await UserType._checkVerificationCodeState(telephone, verification_code)) {
            ErrorHandler.handleParamsError(res, '验证码输入有误')
            return
        }
        let isTelephoneAvailable = await User.findOne({
            where: {
                telephone: telephone
            }
        })
        if (isTelephoneAvailable) {
            ErrorHandler.handleParamsError(res, '该手机号已被注册')
            return
        }
        let cryptoInfo = AccountUtils.cryptoPassWord(password)
        User.create({
            telephone: telephone,
            password: cryptoInfo.crypto_password,
            salt: cryptoInfo.salt,
            channel: channel || 'web_self_register'
        }).then(async res_database => {
            let user_id = res_database.dataValues.id
            let token = new Jwt(user_id).createToken()
            let encode_id = AccountUtils.cryptoUserId(user_id)
            // 暂时不考虑性能的情况下 在用户注册后 直接推送 但用户量大后 考虑会引发前端性能问题
            await global.$socket.broadcast.emit('addUser', {
                user_number: user_id
            })
            res.json({
                status: true,
                msg: '注册成功',
                data: {
                    user_id: encode_id,
                    token: token
                }
            })
            res.end()
        }).catch(err => {
            console.log(err)
        })
    }
    async logout(req, res) {
        res.json({
            status: true,
            msg: '退出成功'
        })
        res.end()
    }
    async completeUserInfo (req, res) {
        let {
            location,
            nick_name,
            sex,
            user_id
        } = req.body
        if (nick_name == '' || sex == -1 || !user_id || !location) {
            ErrorHandler.handleParamsError(res)
            return
        }
        await User.update({
            nick_name: nick_name,
            sex: sex,
            province: location.province,
            city: location.city,
            district: location.district
        }, {
            where: {
                id: user_id
            }
        })
        res.json({
            status: true,
            message: 'success'
        })
        res.end()
    }
    async getUserInfo (req,res) {
        let { token, user_id } = req.body
        if (!token || !user_id) ErrorHandler.handleParamsError(res, '输入参数有误', 500)
        UserType._testTokenState(token).then(async () => {
            let searchResult = await User.findOne({
                attributes: ['telephone', 'nick_name', 'head_url'],
                where: {
                    id: user_id
                }
            })
            let time = new TimeFormat().formateTime('YYYY-MM-DD')
            let query_string = `SELECT COUNT(*) as inform_count FROM inform_member
            INNER JOIN inform ON
            inform_user_id = ${user_id} AND is_read = 0 AND expire_time >= ${time};`
            let inform_count = await sequelizeInstance.query(query_string)
            res.json({
                status: true,
                data: {
                    user_info: searchResult,
                    inform_count: inform_count[0][0].inform_count
                }
            })
            res.end()
        }).catch(()=> {
            ErrorHandler.handleParamsError(res, '登陆状态过期', 401)
        })
    }
    async getUserCenterData (req, res) {
        let { token, user_id } = req.body
        if (!token || !user_id) ErrorHandler.handleParamsError(res, '输入参数有误', 500)
        UserType._testTokenState(token).then(async () => {
            let searchResult = await User.findOne({
                attributes: ['telephone', 'nick_name', 'head_url', 'sex', 'province', 'city', 'district'],
                where: {
                    id: user_id
                }
            })
            if (!searchResult) ErrorHandler.handleParamsError(res, '未找到该用户', 404)
            res.json({
                status: true,
                data: {
                    user_info: searchResult
                }
            })
        }).catch(()=> {
            ErrorHandler.handleParamsError(res, '登陆状态过期', 401)
        })
    }
    async getTokenState(req, res) {
        let {
            token
        } = req.query
        UserType._testTokenState(token).then(() => {
            res.json({
                status: true
            })
            res.end()
        }).catch(()=> {
            ErrorHandler.handleParamsError(res, '登陆状态过期', 401)
        })        
    }
    async getVerificationCode(req, res) {
        let {
            telephone
        } = req.query
        if (!telephone) ErrorHandler.handleParamsError(res, '输入参数有误', 500)
        let is_register = await User.findOne({
            where: {
                telephone: telephone
            }
        })
        if (is_register) {
            res.json({
                data: {
                    err_msg: '该手机号已注册'
                },
                status: false
            })
            res.end();
            return
        }
        telephone = '+86' + telephone
        let value = await redisDao.getValue(telephone)
        let is_send = value != null
        if (is_send) {
            res.json({
                msg: '验证码未失效',
                status: false
            })
            res.end()
            return
        }
        let template_id = sms_conf.template_id.register
        new SmsType().sendSms(template_id, telephone).then(sms_res => {
            // 发送成功
            global.redis_client.set(telephone, sms_res.verification_code)
            global.redis_client.expire(telephone, sms_conf.max_time)
            res.json({
                msg: '验证码发送成功',
                status: true
            })
            res.end()
        }).catch(err => {
            // 发送失败
            res.json({
                msg: '验证码发送失败,请稍后重试',
                status: false
            })
            res.end()
        })
    }
    async getUserFriendShip (req, res) {
        let {
            user_id
        } = req.query
        if ( !user_id ) ErrorHandler.handleParamsError(res, '输入参数有误', 500)
        let user = await User.findOne({
            row: true,
            where: {
                id: user_id
            }
        })
        let follow_num = await user.getFriendShip_befocused()
        let attention_num = await user.getFriendShip_sponsor()
        res.json({
            status: true,
            data: {
                friend_ship: {
                    attention_num: attention_num.length,
                    follow_num: follow_num.length
                }
            }
        })
        res.end()
    }
    async getUserFriendShipDetail (req, res) {
        const PAGE_SIZE = 5
        let {
            interview_user_id,
            mode,
            user_id,
            page
        } = req.body;
        (page == undefined) ? page = 0 : page;
        let offset = page * PAGE_SIZE
        if ( !interview_user_id || page == -1 ) {
            ErrorHandler.handleParamsError(res)
            return
        }
        let decode_interview_user_id = AccountUtils.decodeUserId(interview_user_id)
        mode == undefined ? mode = 1 : +mode
        let interview_user_info = await User.findOne({
            where: {
                id: decode_interview_user_id
            },
            attributes: ['nick_name', 'head_url', 'sex', 'id']
        })   
        let friend_detail, all_number, page_index
        if ( mode == 1 ) {
            all_number = await interview_user_info.countFriendShip_sponsor()
            friend_detail = await interview_user_info.getFriendShip_sponsor({
                offset: offset,
                limit: PAGE_SIZE
            })
        } else {
            all_number = await interview_user_info.countFriendShip_befocused();
            friend_detail = await interview_user_info.getFriendShip_befocused()
        }
        page_index = all_number - (((PAGE_SIZE + 1) * page) + friend_detail.length) > 0 ? ++page : -1
        res.json({
            status: true,
            data: {
                is_self: user_id == decode_interview_user_id,
                interview_user_info: interview_user_info,
                friend_list: friend_detail,
                next_page: page_index,
                page_total: all_number
            }
        })
        res.end()
    }
    async getUserInfoByUpdate (req, res) {
        let {
            user_id
        } = req.body
        if ( !user_id ) {
            ErrorHandler.handleParamsError(res)
            return
        }
        let user_info = await User.findOne({
            where: {
                id: user_id
            },
            attributes: ['nick_name','head_url','sex','province','city','district']
        })
        res.json({
            data: {
                user_info
            },
            status: true
        })
        res.end()
    }
    async updateUserInfo (req, res) {
        let {
            user_id,
            nick_name,
            sex,
            location
        } = req.body
        if (!user_id) {
            ErrorHandler.handleParamsError(res)
            return
        }else if (nick_name != undefined && nick_name == '') {
            ErrorHandler.handleParamsError(res)
            return
        }
        let key = nick_name != undefined ? 'nick_name' : sex != undefined ? 'sex' : 'location'
        let params = {} 
        if (key == 'location') {
            params.province = location.province
            params.city = location.city
            params.district = location.district
        }else {
            params[key] = req.body[key]
        }
        let sql_result = await User.update(params, {
            where: {
                id: user_id
            }
        })
        res.json({
            status: sql_result.length != 0,
            msg: sql_result.length != 0 ? '修改成功' : '修改失败'
        })
        res.end()
    }
}
module.exports = new UserType()