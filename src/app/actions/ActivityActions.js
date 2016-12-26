import alt from '../alt';
import {default as api} from '../../services/apiClient';

class ActivityActions {
    constructor() {
        this.generateActions(
            'fetchAdvisorSuccess',
            'fetchAdvisorFail'
        );
    }

    fetchAdvisor(id) {
        api.getSingleAdvisor(id)
            .then(data => this.fetchAdvisorSuccess(data))
            .catch(error => this.fetchAdvisorFail(error));
    }
}

export default alt.createActions(ActivityActions);