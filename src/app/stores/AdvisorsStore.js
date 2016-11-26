import alt from '../alt';
import AdvisorsActions from '../actions/AdvisorsActions';

class AdvisorsStore {
    constructor() {
        this.bindActions(AdvisorsActions);
        this.advisorGroups = [];
    };

    onFetchAdvisorsSuccess(advisorGroups) {
        this.advisorGroups = advisorGroups;
    }
}

export default alt.createStore(AdvisorsStore, 'AdvisorsStore');