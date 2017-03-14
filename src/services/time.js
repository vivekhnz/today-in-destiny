import moment from 'moment-timezone';

class TimeService {
    /**
     * Returns the date in UTC-9 where the Destiny Daily Reset is at midnight. 
     */
    getCurrentDate() {
        let timestamp = moment.utc().subtract(9, 'hours');
        return {
            month: timestamp.format('MMM'),
            day: timestamp.format('D'),
            year: timestamp.format('YYYY')
        };
    }

    /**
     * Returns the current time in either PST or PDT.
     */
    getPacificTime() {
        let date = moment.utc().tz('America/Los_Angeles');
        return {
            day: date.days(),
            hour: date.hours(),
            minute: date.minutes()
        }
    }

    getCurrentDestinyWeek() {
        // calculate time in UTC-9 (where reset is at midnight)
        let timestamp = moment.utc().subtract(9, 'hours');

        // ensure we are within the same week as the Sunday before the Weekly Reset
        if (timestamp.day() < 2) {
            timestamp.subtract(7, 'days');
        }

        // get start and end of week
        timestamp.startOf('week').add(2, 'days');
        return {
            tuesday: timestamp.format('MMM D'),
            wednesday: timestamp.add(1, 'days').format('MMM D'),
            thursday: timestamp.add(1, 'days').format('MMM D'),
            friday: timestamp.add(1, 'days').format('MMM D'),
            saturday: timestamp.add(1, 'days').format('MMM D'),
            sunday: timestamp.add(1, 'days').format('MMM D'),
            monday: timestamp.add(1, 'days').format('MMM D'),
        };
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