const redisDao = {
    getValue (key) {
        return new Promise((reslove, reject) => {
            redis_client.get(key, (err, result) => {
                if (err) {
                    reject(err)
                }else {
                    reslove(result)
                }
            })
        })
    }
}
module.exports = redisDao