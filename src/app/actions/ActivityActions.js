import alt from '../alt';
import {default as api} from '../../services/apiClient';

class ActivityActions {
    constructor() {
        this.generateActions(
            'setAdvisorSuccess',
            'fetchActivitySuccess',
            'fetchActivityFail'
        );
    }

    setAdvisor(advisor) {
        this.setAdvisorSuccess(advisor);
    }

    fetchActivity(id) {
        api.getActivity(id)
            .then(data => this.fetchActivitySuccess(data))
            .catch(error => this.fetchActivityFail(error));
    }
}

export default alt.createActions(ActivityActions);