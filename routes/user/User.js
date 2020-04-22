const { ErrorHandler, AccountUtils, Jwt } = require('../../utils/index')
const { UserModel } = require('../../model/db/index')
class User {
    constructor() {
    }
    async login(req, res) {
        let {
            telephone,
            password
        } = req.body
        console.log(telephone, password)
        res.json({
            status: true,
            data: {
                token: 200
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
        let cryptoInfo = AccountUtils.cryptoPassWord()
        UserModel.create({
            telephone: telephone,
            password: cryptoInfo.crypto_password,
            salt: cryptoInfo.salt
        }).then(res_database => {
            let user_id = res_database.dataValues.id
            let token = new Jwt(user_id).createToken()
            res.json({
                status: true,
                msg: '注册成功',
                data: {
                    token: token
                }
            })
            res.end()  
        }).catch(err => {
            console.log(err)
        })
    }
    getVerificationCode(req, res) {
        res.end()
    }
}
module.exports = User