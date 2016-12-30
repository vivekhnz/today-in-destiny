import alt from '../alt';
import AdvisorsActions from '../actions/AdvisorsActions';

class AdvisorsStore {
    constructor() {
        this.bindActions(AdvisorsActions);
        this.advisorGroups = [];
    };

    onFetchAdvisorsSuccess(response) {
        this.advisorGroups = response.advisorGroups;
    }

    onFetchAdvisorsFail(error) {
        this.errorMessage = error.message;
    }
}

export default alt.createStore(AdvisorsStore, 'AdvisorsStore');