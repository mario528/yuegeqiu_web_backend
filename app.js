let express = require('express')
let path = require('path')
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let routeDecorate = require('./routes/index')

let app = express()

// add app middleWare
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
// register router middleWare
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/docs', express.static('public/swagger'))

routeDecorate(app)

app.listen(3000, () => {
    console.log("Now Node.js server is running")
})