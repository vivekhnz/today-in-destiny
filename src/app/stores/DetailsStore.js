import alt from '../alt';
import DetailsActions from '../actions/DetailsActions';

class DetailsStore {
    constructor() {
        this.bindActions(DetailsActions);
        this.details = {};
        this.errorMessage = null;
    };

    onFetchAdvisorSuccess(response) {
        if (response.id && response.details) {
            this.details[response.id] = response.details;
        }
    }

    onFetchAdvisorFail(error) {
        this.errorMessage = error.message;
    }
}

export default alt.createStore(DetailsStore, 'DetailsStore');