const formatFns = require('date-fns/format');
const formatDistanceStrict = require('date-fns/formatDistanceStrict');

class DateService {
    constructor() {
        this.months = {
            January : 1,
            February: 2,
            March: 3,
            April: 4,
            May: 5,
            June: 6,
            July: 7,
            August:8,
            September: 9,
            October: 10,
            November: 11,
            December: 12
        }
    }

    convertMilisecond(ms) {
        const now = this.now();
        const dayInMs = 86400000;
        const unit = ms < dayInMs ? 'hour' : 'day'

        return formatDistanceStrict(now, now+ms, {unit})
    }

    format (date, format = 'MM-yy') {
        return formatFns(date, format);
    }

    now() {
        return (new Date()).getTime();
    }

    getMonthsList() {
        return this.months;
    }

    getMonthsReverseList() {
        const keys = Object.keys(this.months);
        const result = {};

        keys.forEach((key) => result[this.months[key]] = key);
        return result;
    }
}

module.exports = DateService;
