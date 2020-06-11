const tencent_cloud = require('tencentcloud-sdk-nodejs')
const smsClient = tencent_cloud.sms.v20190711.Client;
const models = tencent_cloud.sms.v20190711.Models;
const Credential = tencent_cloud.common.Credential;
const ClientProfile = tencent_cloud.common.ClientProfile;
const HttpProfile = tencent_cloud.common.HttpProfile;
const sms_conf = require('../conf/sms/sms')
const {
    Sms
} = require('../model/db/modules/index')
const TimeFormat = require('./time')
class SmsType {
    constructor() {
        // 实例化认证对象
        this.cred = new Credential(sms_conf.secret_id, sms_conf.secret_key);
        const httpProfile = new HttpProfile();
        const clientProfile = new ClientProfile();
        httpProfile.reqMethod = "POST";
        httpProfile.reqTimeout = 30;
        httpProfile.endpoint = "sms.tencentcloudapi.com";
        clientProfile.httpProfile = httpProfile
        this.client = new smsClient(this.cred, "ap-guangzhou", clientProfile);
    }
    _createVerificationCode(throne = 6) {
        let verification_code = ''
        for (let i = 0; i < throne; i++) {
            verification_code += Math.floor(Math.random() * 10)
        }
        return verification_code
    }
    _createSmsContent (data, type) {
        let str = ''
        switch (type) {
            case 'register':
                str = `您的注册验证码：${data}，如非本人操作，请忽略本短信！`
                break;
            case 'login':
                str = `验证码为：${data}，您正在登录，若非本人操作，请勿泄露。`
                break;
            case 'reset_password':
                str = `您的动态验证码为：${data}，您正在进行密码重置操作，如非本人操作，请忽略本短信！`
            break;   
        }
        return str
    }
    async _checkVerificationCode(telephone) {
        await redisDao.getValue(telephone) == null
    }
    async sendSms(templete_id, ...telephone) {
        const that = this
        let req = new models.SendSmsRequest();
        // 应用ID
        req.SmsSdkAppid = '1400356048';
        // 签名内容
        req.Sign = "约球YQ";
        // req.SessionContext = "";
        req.PhoneNumberSet = [...telephone];
        // 模版ID
        req.TemplateID = templete_id;
        // 模版参数
        let verification_code = this._createVerificationCode()
        req.TemplateParamSet = [verification_code];
        return new Promise((reslove, reject) => {
            this.client.SendSms(req, async (err, response) => {
                // 请求异常返回，打印异常信息
                if (err) {
                    reject(err);
                }
                let time = new TimeFormat().formateTime('YYYY-MM-DD HH:MM:SS')
                let expire_time = new TimeFormat(new Date(new Date(time).valueOf() + 5 * 60 * 1000)).formateTime('YYYY-MM-DD HH:MM:SS')
                let content = this._createSmsContent(verification_code, 'register')
                await Sms.create({
                    telephone: telephone[0].split('+86')[1],
                    sms_content: content,
                    send_datetime: time,
                    expire_time: expire_time
                })
                // 请求正常返回，打印 response 对象
                response.verification_code = verification_code
                reslove(response);
            });
        })
    }
}
module.exports = SmsType