import alt from '../alt';
import AdvisorsActions from '../actions/AdvisorsActions';

class DateStore {
    constructor() {
        this.bindActions(AdvisorsActions);
        this.date = null;
    };

    onFetchAdvisorsSuccess(response) {
        this.date = response.date;
    }
}

export default alt.createStore(DateStore, 'DateStore');