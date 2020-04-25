const Home = require('./home/index')
const User = require('./user/index')
const City = require('./city/index')
module.exports = (app) => {
    app.use(Home)
    app.use(User)
    app.use(City)
}