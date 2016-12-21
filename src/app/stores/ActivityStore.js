import alt from '../alt';
import ActivityActions from '../actions/ActivityActions';

class ActivityStore {
    constructor() {
        this.bindActions(ActivityActions);
    };
}

export default alt.createStore(ActivityStore, 'ActivityStore');