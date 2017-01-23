import alt from '../alt';
import AdvisorsActions from '../actions/AdvisorsActions';

class AdvisorsStore {
    constructor() {
        this.bindActions(AdvisorsActions);
        this.summaries = {};
        this.categories = [];
    };

    onFetchAdvisorsSuccess(response) {
        if (response.advisors) {
            this.summaries = response.advisors.summaries;
            this.categories = response.advisors.categories;
        }
    }

    onFetchAdvisorsFail(error) {
        this.errorMessage = error.message;
    }
}

export default alt.createStore(AdvisorsStore, 'AdvisorsStore');