class TimeService {
    /**
     * Returns the date in UTC-9 where the Destiny Daily Reset is at midnight. 
     */
    getCurrentDate() {
        // calculate time in UTC-9 (where reset is at midnight)
        var date = new Date();
        date.setHours(date.getUTCHours() - 9);

        let months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return {
            month: months[date.getMonth()],
            day: date.getDate(),
            year: date.getFullYear()
        };
    }
};

export default new TimeService();