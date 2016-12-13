export default class ManifestService {
    constructor(definitions) {
        if (definitions) {
            this.definitions = {
                activities: definitions.activities || [],
                items: definitions.items || []
            };
        }
        else {
            this.definitions = {
                activities: [],
                items: []
            };
        }
    }

    getActivity(hash) {
        return this.definitions.activities[hash];
    }

    getItem(hash) {
        return this.definitions.items[hash];
    }
};