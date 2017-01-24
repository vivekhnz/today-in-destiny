import alt from '../alt';
import AdvisorsActions from '../actions/AdvisorsActions';

class AdvisorsStore {
    constructor() {
        this.bindActions(AdvisorsActions);
        this.categories = [];
        this.categoryMap = {};
    };

    onFetchAdvisorsSuccess(response) {
        if (response.categories) {
            this.categories = response.categories;
        }
        if (response.categoryMap) {
            this.categoryMap = response.categoryMap;
        }
    }

    onFetchAdvisorsFail(error) {
        this.errorMessage = error.message;
    }
}

export default alt.createStore(AdvisorsStore, 'AdvisorsStore');