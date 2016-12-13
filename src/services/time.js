class TimeService {
    /**
     * Returns the date in UTC-9 where the Destiny Daily Reset is at midnight. 
     */
    getCurrentDate() {
        // calculate time in UTC-9 (where reset is at midnight)
        var date = new Date();
        date.setUTCHours(date.getUTCHours() - 9);

        let months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return {
            month: months[date.getUTCMonth()],
            day: date.getUTCDate(),
            year: date.getUTCFullYear()
        };
    }

    getRemainingTime(utcTime) {
        let currentTime = new Date();
        let endTime = Date.parse(utcTime);
        let totalMs = endTime - currentTime.getTime();
        return this.getTimespanString(totalMs);
    }

    getTimespanString(totalMs) {
        let totalSeconds = totalMs / 1000;
        let totalMinutes = totalSeconds / 60;
        let totalHours = totalMinutes / 60;
        let totalDays = totalHours / 24;

        let hours = Math.floor(totalHours % 24);
        let minutes = Math.floor(totalMinutes % 60);

        if (totalDays >= 1) {
            return `${Math.floor(totalDays)}d ${hours}h`;
        }
        return `${Math.floor(totalHours)}h ${minutes}m`;
    }
};

export default new TimeService();