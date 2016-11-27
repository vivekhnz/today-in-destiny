import alt from '../alt';
import AdvisorsService from '../services/AdvisorsService';

class AdvisorsActions {
    constructor() {
        this.generateActions(
            'fetchAdvisorsSuccess'
        );
    }

    fetchAdvisors() {
        AdvisorsService.fetchAdvisors()
            .then(data => this.fetchAdvisorsSuccess(data))
            .catch(() => console.log("Couldn't load advisors."));
    }
}

export default alt.createActions(AdvisorsActions);