const sequelizeInstance = require('../../Dao/dbConnect')
const fs = require('fs')
const path = require('path')
const log = console.log
const ignoreFile = ['index.js','teamMemberModel.js']
log('==== start reslove update databases modules ====')
let files = fs.readdirSync(path.resolve(__dirname, '../modules'))
log(files)
let fileWithJsList = files.filter((f) => {
    return (f.endsWith('.js') && ignoreFile.indexOf(f) == -1)
})
log(fileWithJsList)
for( let f of fileWithJsList ) {
    let fileName = f.substring(0, f.length - 3)
    module.exports[fileName] = require(path.resolve(__dirname, `../modules/${fileName}`))
}
require('../relation/relation')
sequelizeInstance.sync({
    force: true
})
sequelizeInstance.afterBulkSync('syncEnd', function () {
    const {
        User,
        friendShip,
        Team,
        teamMember
    } = require('../modules/index')
    console.log(User.setTeamMember, "++++++++++++++++++")
    log('==== databases modules reslove end ====')
})