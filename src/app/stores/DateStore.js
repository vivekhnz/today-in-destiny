import alt from '../alt';
import AdvisorsActions from '../actions/AdvisorsActions';
import ActivityActions from '../actions/ActivityActions';

class DateStore {
    constructor() {
        this.bindActions(AdvisorsActions);
        this.bindActions(ActivityActions);
        this.date = null;
    };

    onFetchAdvisorsSuccess(response) {
        this.date = response.date;
    }

    onFetchAdvisorSuccess(response) {
        this.date = response.date;
    }
}

export default alt.createStore(DateStore, 'DateStore');