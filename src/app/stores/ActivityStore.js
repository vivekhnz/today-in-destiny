import alt from '../alt';
import {default as time} from '../../services/time';
import ActivityActions from '../actions/ActivityActions';

class ActivityStore {
    constructor() {
        this.bindActions(ActivityActions);
        this.date = time.getCurrentDate();
        this.activity = null;
    };

    onSetAdvisorSuccess(advisor) {
        this.activity = advisor;
    }

    onFetchActivitySuccess(response) {
        this.date = response.date;
        this.activity = response.activity;
    }

    onFetchActivityFail(error) {
        this.errorMessage = error.message;
    }
}

export default alt.createStore(ActivityStore, 'ActivityStore');