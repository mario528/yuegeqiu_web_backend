let ossStore = require('../../conf/oss/oss')
let OSS = require('ali-oss')
let fs = require('fs')
let path = require('path')

class OssController {
    constructor() {
        this.client = this._init()
        this.mode = 'BucketOwner'
        this.bucketName = ossStore.bucketName
    }
    _init() {
        return new OSS(ossStore)
    }
    getBucketList() {
        this.client.listBuckets().then(res => {
            let {
                buckets
            } = res
            return buckets
        })
    }
    getBucketACL(bucketName) {
        this.client.getBucketACL(bucketName).then(res => {
            return res
        })
    }
    changePaymentMode() {
        this.mode == 'Requester' ? 'BucketOwner' : 'Requester'
        this.client.putBucketRequestPayment(this.bucketName, this.mode).then(res => {
            console.log('request payment mode is changed')
        })
    }
    delBucket(bucketName) {
        try {
            this.client.deleteBucket(bucketName).then(res => {
                console.log(`delete bucket ${bucketName} success`)
            })
        } catch (error) {
            console.error(error)
        }
    }
    putBucketTag(tag) {
        this.client.putBucketTag(this.bucketName, tag).then(res => {
            console.log(res)
        })
    }
    getBucketTag() {
        this.client.getBucketTags(this.bucketName, tag).then(res => {
            return res
        })
    }
    upLoadFile(fileName, filePath, meta = {}) {
        this.client.put(fileName, filePath, {
            meta
        }).then(res => {
            console.log(res)
        })
    }
    downloadFile(fileName, filePath) {
        this.client.get(fileName, filePath).then(res => {
            console.log(res)
        })
    }
    downloadFileByHttp(fileName) {
        this.client.signatureUrl(fileName, {
            expires: 3600
        }).then(res => {
            console.log(res)
        })
    }
    delFileName(fileName) {
        if (Array.isArray(fileName)) {
            this.client.deleteMulti(fileName).then(res => {
                console.log(res)
            })
        } else {
            this.client.delete(fileName).then(res => {
                console.log(res)
            })
        }
    }
}
module.exports = OssController