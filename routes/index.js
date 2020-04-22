const Home = require('./home/index')
const User = require('./user/index')
module.exports = (app) => {
    app.use(Home)
    app.use(User)
}