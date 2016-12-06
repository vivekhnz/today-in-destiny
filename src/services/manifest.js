export default class ManifestService {
    constructor(definitions) {
        if (definitions) {
            this.definitions = {
                activities: definitions.activities
            };
        }
        else {
            this.definitions = {
                activities: []
            };
        }
    }

    getActivity(hash) {
        return this.definitions.activities[hash];
    }
};