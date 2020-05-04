const Home = require('./home/index')
const User = require('./user/index')
const City = require('./cityData/index')
const FileRouter = require('./file/index')
const Team = require('./team/index')

module.exports = (app) => {
    app.use(Home)
    app.use(User)
    app.use(City)
    app.use(FileRouter)
    app.use(Team)
}