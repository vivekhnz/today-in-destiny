let MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

class TimeService {
    /**
     * Returns the date in UTC-9 where the Destiny Daily Reset is at midnight. 
     */
    getCurrentDate() {
        // calculate time in UTC-9 (where reset is at midnight)
        var date = new Date();
        date.setUTCHours(date.getUTCHours() - 9);

        return {
            month: MONTHS[date.getUTCMonth()],
            day: date.getUTCDate(),
            year: date.getUTCFullYear()
        };
    }

    getCurrentWeekString() {
        // calculate time in UTC-9 (where reset is at midnight)
        var date = new Date();
        date.setUTCHours(date.getUTCHours() - 9);
        
        // find the date of the start of the week
        let day = date.getUTCDay();
        if (day < 2) {
            date.setDate(date.getDate() - (day + 5));
        }
        else if (day > 2) {
            date.setDate(date.getDate() - (day - 2));
        }
        let start = `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;

        // find the date of the end of the week
        date.setDate(date.getDate() + 6);
        let end = `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;

        return `${start} - ${end}`;
    }

    getElapsedMilliseconds(utcTime) {
        let currentTime = new Date();
        let startTime = Date.parse(utcTime);
        return currentTime.getTime() - startTime;
    }

    getRemainingTime(utcTime) {
        let currentTime = new Date();
        let endTime = Date.parse(utcTime);
        let totalMs = endTime - currentTime.getTime();
        return this.getTimespanString(totalMs);
    }

    getTimespanString(totalMs) {
        let totalMinutes = totalMs / 60000;
        let totalHours = totalMinutes / 60;
        let totalDays = totalHours / 24;

        let hours = Math.floor(totalHours % 24);
        let minutes = Math.floor(totalMinutes % 60);

        if (totalDays >= 1) {
            return `${Math.floor(totalDays)}d ${hours}h`;
        }
        return `${Math.floor(totalHours)}h ${minutes}m`;
    }

    getHoursMinutes(milliseconds) {
        let hours = milliseconds / 3600000;
        let totalHours = Math.floor(hours);
        let minutes = (hours - totalHours) * 60;

        return {
            hours: totalHours,
            minutes: minutes
        };
    }
};

export default new TimeService();