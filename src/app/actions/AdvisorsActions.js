import alt from '../alt';
import {default as api} from '../../services/apiClient';

class AdvisorsActions {
    constructor() {
        this.generateActions(
            'fetchAdvisorsSuccess',
            'fetchAdvisorsFail'
        );
    }

    fetchAdvisors() {
        api.getAdvisors()
            .then(data => this.fetchAdvisorsSuccess(data))
            .catch(error => this.fetchAdvisorsFail(error));
    }
}

export default alt.createActions(AdvisorsActions);