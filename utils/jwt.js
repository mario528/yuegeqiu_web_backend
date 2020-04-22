const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const conf = require('../conf/index')

class Jwt {
    constructor(userId) {
        this._id = userId
    }
    createToken() {
        let secret = fs.readFileSync(path.resolve(__dirname, '../pem/jwt.pem'))
        let token = jwt.sign({
            user_id: this._id
        }, secret, {
            expiresIn: conf.expiresTime,
            algorithm: 'RS256'
        })
        return token
    }
    verifyTokenAvailable(token) {
        try {
            let secret = fs.readFileSync(path.resolve(__dirname, '../pem/jwt_pub.pem'))
            let result = jwt.verify(token, secret)
            const { user_id, iat, exp } = result
            let currentTime = Math.floor(Date.now() / 1000)
            return {
                user_id: user_id,
                state: currentTime <= exp
            }
        } catch (error) {
            return {
                user_id: null,
                state: false
            }
        }
    }
}
module.exports = Jwt