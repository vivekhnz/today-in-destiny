import moment from 'moment-timezone';

class TimeService {
    /**
     * Returns the date in UTC-9 where the Destiny Daily Reset is at midnight. 
     */
    getCurrentDate() {
        let timestamp = moment.utc().subtract(9, 'hours');
        return {
            month: timestamp.format('MMM'),
            day: timestamp.format('DD'),
            year: timestamp.format('YYYY')
        };
    }

    getUTCWeekTime() {
        var date = new Date();
        return {
            day: date.getUTCDay(),
            hour: date.getUTCHours(),
            minute: date.getUTCMinutes()
        }
    }

    getCurrentWeekString() {
        // calculate time in UTC-9 (where reset is at midnight)
        let timestamp = moment.utc().subtract(9, 'hours');

        // ensure we are within the same week as the Sunday before the Weekly Reset
        if (timestamp.day() < 2) {
            timestamp.subtract(7, 'days');
        }

        // get start and end of week
        let start = timestamp.startOf('week').add(2, 'days').format('MMM DD');
        let end = timestamp.add(6, 'days').format('MMM DD');

        return `${start} - ${end}`;
    }

    now() {
        return moment.utc().format();
    }

    since(utcTime) {
        let now = moment.utc();
        let past = moment.utc(utcTime);
        return now.diff(past);
    }

    until(utcTime) {
        let now = moment.utc();
        let future = moment.utc(utcTime);
        return future.diff(now);
    }

    formatDuration(totalMs) {
        let duration = moment.duration(totalMs);
        if (duration.days() > 0) {
            return `${duration.days()}d ${duration.hours()}h`;
        }
        return `${duration.hours()}h ${duration.minutes()}m`;
    }

    asDuration(utcTime) {
        let epoch = moment.unix(0);
        let timestamp = moment.utc(utcTime);
        let duration = moment.duration(timestamp.diff(epoch));
        return {
            totalHours: Math.floor(duration.asHours()),
            minutes: duration.minutes()
        };
    }
};

export default new TimeService();