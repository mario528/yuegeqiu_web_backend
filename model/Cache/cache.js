let redis_cache = {
    set(key, value) {
        value = JSON.stringify(value)
        return redis_client.set(key, value)
    },
    async get (key) {
        let value = await new Promise((reslove, reject) => {
            redis_client.get(key, (err, res) => {
                if (err) throw new Error(err)
                else {
                    reslove(res)
                }
            })
        })
        return JSON.parse(value)
    },
    del (key) {
        redis_client.del(key)
    }
}
module.exports = redis_cache