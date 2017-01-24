import alt from '../alt';
import {default as api} from '../../services/apiClient';

class DetailsActions {
    constructor() {
        this.generateActions(
            'fetchAdvisorSuccess',
            'fetchAdvisorFail'
        );
    }

    fetchAdvisor(category, id) {
        api.getCategoryAdvisor(category, id)
            .then(data => this.fetchAdvisorSuccess(data))
            .catch(error => this.fetchAdvisorFail(error));
    }
}

export default alt.createActions(DetailsActions);