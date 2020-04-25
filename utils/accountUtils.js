const crypto = require('crypto')
const conf = require('../conf/index')
const AccountUtils = {
    /**
     * create salt
     */
    _createSalt () {
        return +new Date() + Math.random().toString().slice(2,5)
    },
    cryptoPassWord (password, saveSalt) {
        if (!password) {
            throw new Error('cryptoPassWord Function must input a password for crypto')
        }
        let salt = saveSalt || this._createSalt()
        let saltPassWord = password + ':' + salt
        let md5 = crypto.createHash('md5')
        let crypto_password = md5.update(saltPassWord).digest('hex')
        return {
            salt,
            crypto_password
        }
    },
    /**
     * encode user_id by crypto
     * @param {*} id  user_id before encode
     */
    cryptoUserId (id) {
        let cipher = crypto.createCipher('aes192', conf.secretKey)
        let enc = cipher.update(id.toString(), "utf8", "hex")
        enc += cipher.final('hex')
        return enc
    },
    /**
     * decode user_id
     * @param {*} encode_id  encode user_id
     */
    decodeUserId (encode_id) {
        let decipher = crypto.createDecipher('aes192', conf.secretKey)
        let dec = decipher.update(encode_id, 'hex', 'utf8');
        dec += decipher.final('utf8')
        return dec
    }
}
module.exports = AccountUtils
