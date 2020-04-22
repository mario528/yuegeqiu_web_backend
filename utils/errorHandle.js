const ErrorHandle = {
    handleParamsError: function (res, msg = '输入参数有误') {
        res.json({
            msg: msg,
            status: false
        })
        res.end()
    }
}
module.exports = ErrorHandle;