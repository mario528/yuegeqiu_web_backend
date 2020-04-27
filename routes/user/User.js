const {
    ErrorHandler,
    AccountUtils,
    Jwt,
} = require('../../utils/index')
const {
    UserModel
} = require('../../model/db/index')
class User {
    constructor() {}
    static _testTokenState (token) {
        if (!token) return false
        let tokenAvailable = new Jwt().verifyTokenAvailable(token)
        if (!tokenAvailable) return false
        return true
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
        let searchResult = await UserModel.findAll({
            where: {
                telephone: telephone
            }
        })
        if (searchResult.length == 0) {
            ErrorHandler.handleParamsError(res, '该手机号未注册')
            return
        }
        let accountInfo = searchResult[0].dataValues
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
            verification_code
        } = req.body
        if (!telephone || !password || !verification_code) {
            ErrorHandler.handleParamsError(res)
            return
        }
        let isTelephoneAvailable = await UserModel.findAll({
            where: {
                telephone: telephone
            }
        })
        if (isTelephoneAvailable.length != 0) {
            ErrorHandler.handleParamsError(res, '该手机号已被注册')
            return
        }
        let cryptoInfo = AccountUtils.cryptoPassWord(password)
        UserModel.create({
            telephone: telephone,
            password: cryptoInfo.crypto_password,
            salt: cryptoInfo.salt
        }).then(res_database => {
            let user_id = res_database.dataValues.id
            let token = new Jwt(user_id).createToken()
            let encode_id = AccountUtils.cryptoUserId(user_id)
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
        let encode_user_id = AccountUtils.decodeUserId(user_id)
        await UserModel.update({
            nick_name: nick_name,
            sex: sex,
            province: location.province,
            city: location.city,
            district: location.district
        }, {
            where: {
                id: encode_user_id
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
        let token_available = User._testTokenState(token)
        if (!token_available) {
            ErrorHandler.handleParamsError(res, '登陆状态过期', 401)
        }
        let decode_user_id = AccountUtils.decodeUserId(user_id)
        let searchResult = await UserModel.findAll({
            attributes: ['telephone', 'nick_name', 'head_url'],
            where: {
                id: decode_user_id
            }
        })
        res.json({
            status: true,
            data: {
                user_info: searchResult[0]
            }
        })
        res.end()
    }
    async getTokenState(req, res) {
        let {
            token
        } = req.query
        const available = User._testTokenState(token)
        if (!available) {
            ErrorHandler.handleParamsError(res, '登陆状态过期', 401)
        }
        res.json({
            status: available
        })
        res.end()
    }
    getVerificationCode(req, res) {
        res.end()
    }
}
module.exports = User