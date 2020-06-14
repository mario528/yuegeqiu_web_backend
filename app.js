let express = require('express')
let path = require('path')
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let mongoose = require('mongoose')
let routeDecorate = require('./routes/index')
let redis_conf = require('./conf/redis/redisConfig')
let mongo_db_conf = require('./conf/mongodb/mongodb')
let app = express()
let http = require('http').createServer(app)
let socket_io = require('socket.io')(http)
let cache = require('./model/Cache/cache')
let { AccountUtils } = require('./utils/index')
// gloabl redis_client
global.redis_client = require('redis').createClient(redis_conf)
// connect mongodb
mongoose.connect(mongo_db_conf.mongo_db_path)
const db = mongoose.connection
db.on('error',() => {
    console.log("mongodb database connect error")
}) 
db.once('open', () => {
    console.log("mongodb database connect successful")
})
require('./model/Mongodb/dao')
// add app middleWare
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
// register router middleWare
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/docs', express.static('public/swagger'))

// user-defined middleware
app.use(function(req, res, next) {
    // decode user_id in req 
    if (req.body.user_id || req.query.user_id) {
        req.body.user_id ? req.body.user_id = AccountUtils.decodeUserId(req.body.user_id) :  req.query.user_id = AccountUtils.decodeUserId(req.query.user_id)
    }
    next()
})

routeDecorate(app)
const server = http.listen(3000, () => {
    console.log("Now Node.js server is running")
})
global.online_number = Math.floor(Math.random()*100)
// websocket 
// socket_io.sockets.emit 所有用户
// socket_io.sockets.socket(socket_id).emit 给指定客户端发送消息
// join 加入分组 leave 离开分组 订阅模式
// socket_client.broadcast.to(group_name).emit 分组内广播
// socket_io.sockets.in(group_name).emit 分组内除自己外广播
socket_io.on('connection', (socket_client) => {
    console.log("创建socket连接")
    global.online_number = ++ global.online_number
    global.$socket = socket_client
    global.$socket_io = socket_io
    socket_io.sockets.emit('onlineNumber', {
        online_number: global.online_number
    })
    // 加入球队聊天室
    socket_client.on('connectTeamChat', data => {
        socket_client.join(`teamId${data.team_id}`)
    })
    // 离开球队聊天室
    socket_client.on('disconnectTeamChat', data => {
        socket_client.leave(`teamId${data.team_id}`)
    })
    socket_client.on('disconnect', () => { 
       global.online_number = -- global.online_number
       socket_io.sockets.emit('onlineNumber', {
        online_number: global.online_number
      })
      console.log("断开连接")
    });
 })