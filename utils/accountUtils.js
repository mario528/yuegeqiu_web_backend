const crypto = require('crypto')
const AccountUtils = {
    _createSalt () {
        return +new Date() + Math.random().toString().slice(2,5)
    },
    cryptoPassWord (password) {
        let salt = this._createSalt()
        let saltPassWord = password + ':' + salt
        let md5 = crypto.createHash('md5')
        let crypto_password = md5.update(saltPassWord).digest('hex')
        return {
            salt,
            crypto_password
        }
    }
}
module.exports = AccountUtils