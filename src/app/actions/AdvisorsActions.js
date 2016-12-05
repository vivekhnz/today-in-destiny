import alt from '../alt';
import {default as api} from '../../services/api';

class AdvisorsActions {
    constructor() {
        this.generateActions(
            'fetchAdvisorsSuccess'
        );
    }

    fetchAdvisors() {
        api.getAdvisors()
            .then(data => this.fetchAdvisorsSuccess(data))
            .catch(() => console.log("Couldn't load advisors."));
    }
}

export default alt.createActions(AdvisorsActions);