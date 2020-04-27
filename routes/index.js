const Home = require('./home/index')
const User = require('./user/index')
const City = require('./cityData/index')
const File = require('./file/index')

module.exports = (app) => {
    app.use(Home)
    app.use(User)
    app.use(City)
    app.use(File)
}