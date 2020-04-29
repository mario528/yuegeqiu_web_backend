class Time {
    constructor() {
        this.date = new Date()
        this.YYYYMMDD = `${this.date.getFullYear()}-${(this.date.getMonth() + 1) < 10 ? '0' + (this.date.getMonth() + 1) : this.date.getMonth() + 1}-${this.date.getDate()}`
        this.HHMMSS = `${this._adjustLayout(this.date.getHours())}:${this._adjustLayout(this.date.getMinutes())}:${this._adjustLayout(this.date.getMinutes())}`
    }
    _adjustLayout (timeData) {
        return timeData < 10 ? '0' + timeData : timeData
    }
    formateTime(type) {
        type = type.toUpperCase()
        switch (type) {
            case 'YYYY-MM-DD':
                return this.YYYYMMDD
            case 'YYYY-MM-DD HH:MM:SS':
                return `${this.YYYYMMDD} ${this.HHMMSS}`
            default:
                throw new Error('输入参数有误')
        }
    }
}
module.exports = new Time()
