class TimeType {
    constructor(date = new Date()) {
        this.date = date
        this.YYYYMMDD = `${this.date.getFullYear()}-${(this.date.getMonth() + 1) < 10 ? '0' + (this.date.getMonth() + 1) : this.date.getMonth() + 1}-${this._adjustLayout(this.date.getDate())}`
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
    getMondayBeforeToady () {
        let week = this.date.getDay()
        if (week == 1) {
            // 当天就是周一
            return new TimeType().formateTime('YYYY-MM-DD')
        }else {
            let days = week == 0 ? 6 : week - 1
            let timeStemp = new Date().valueOf() - (days * 24 * 60 * 60 * 1000)
            return new TimeType(new Date(timeStemp)).formateTime('YYYY-MM-DD')
        }
    }
    getSundayAfterDay ( afterDays = 0 ) {
        let time = new Date().valueOf() + ( afterDays * 24 * 60 * 60 * 1000 )
        let week = new Date(time).getDay()
        week = week == 0 ? 7 : week
        let days = 7 - week
        let timeStemp = time + (days * 24 * 60 * 60 * 1000)
        return new TimeType(new Date(timeStemp)).formateTime('YYYY-MM-DD')
    }
    getNextDay(date) {
        let dateTime = new Date((new Date(date).valueOf() + (24 * 60 * 60 * 1000)));
        return new TimeType(dateTime).formateTime('YYYY-MM-DD')
    }
    generateTimeCalendar (start_time, end_time, calendar_list = []) {
        let pointer = start_time
        if (pointer == end_time) {
            calendar_list.push({
                date: pointer,
                is_weekend: [0,6].includes(new Date(pointer).getDay()) 
            })
            return calendar_list
        }else {
            calendar_list.push({
                date: pointer,
                is_weekend: [0,6].includes(new Date(pointer).getDay()) 
            })
            pointer = this.getNextDay(pointer)
            return this.generateTimeCalendar(pointer, end_time, calendar_list)
        }
    }
}
module.exports = TimeType