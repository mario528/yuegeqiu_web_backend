const fs = require('fs')
const path = require('path')
const { IncomingForm } = require('formidable')
const OSS = require('ali-oss')
const OssFiles = require('../../model/OSSController/OssFiles')
const ossStore = require('../../conf/oss/oss')
const {
    AccountUtils,
    ErrorHandler
} = require('../../utils/index')
const {
    UserModel
} = require('../../model/db/index')
class File extends OssFiles{
    constructor () {
        super()
    }
    upLoadUserIcon (req, res) {
        let form = IncomingForm()
        let user_id, save_file_name, ext_name
        let client = new OSS(ossStore)
        form.uploadDir = path.resolve(__dirname, "../../public/avatar")
        form.keepExtensions= true
        form.parse(req, (err, fields, files) => {
            user_id = fields['user_id']
            save_file_name = path.basename(files.file.path)
            ext_name = path.extname(files.file.path)
        })
        form.on('error', function(err) {
            ErrorHandler.handleParamsError(res, '请稍后重试', 500)
        })
        form.on('end',() => {
            let old_path = path.resolve(__dirname, `../../public/avatar/${save_file_name}`)
                ,new_path = path.resolve(__dirname, `../../public/avatar/${user_id}${ext_name}`)
            fs.rename(old_path,new_path,async ()=> {
                // let ossResult = await super.upLoadFile(save_file_name,new_path)
                client.put(`${user_id}${ext_name}`, new_path, {}).then(async ossResult => {
                    await UserModel.update({
                        head_url: ossResult.url
                    }, {
                        where: {
                            id: AccountUtils.decodeUserId(user_id)
                        }
                    })
                    res.json({
                        data: {
                            avatar_url: ossResult.url
                        },
                        status: true
                    })
                    res.end()
                })
            })
        })
        form.parse(req);
    }
}
module.exports = new File()