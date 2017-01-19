export default class ManifestService {
    constructor(definitions) {
        if (!definitions) definitions = {};
        this.definitions = {
            activities: definitions.activities || [],
            items: definitions.items || [],
            stats: definitions.stats || [],
            perks: definitions.perks || []
        };
    }

    getActivity(hash) {
        return this.definitions.activities[hash];
    }

    getItem(hash) {
        return this.definitions.items[hash];
    }

    getStat(hash) {
        return this.definitions.stats[hash];
    }

    getPerk(hash) {
        return this.definitions.perks[hash];
    }
};