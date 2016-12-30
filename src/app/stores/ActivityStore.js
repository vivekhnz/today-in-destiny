import alt from '../alt';
import ActivityActions from '../actions/ActivityActions';

class ActivityStore {
    constructor() {
        this.bindActions(ActivityActions);
        this.activity = null;
    };

    onFetchAdvisorSuccess(response) {
        this.activity = response.advisor;
    }

    onFetchAdvisorFail(error) {
        this.errorMessage = error.message;
    }
}

export default alt.createStore(ActivityStore, 'ActivityStore');