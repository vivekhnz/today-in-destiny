export default class AdvisorsService {
    constructor(activities, manifest) {
        this.activities = activities;
        this.manifest = manifest;
        this.parsers = {
            'xur': this.parseXur,
            'trials': this.parseTrials,
            'dailychapter': this.parseDailyStory,
            'dailycrucible': this.parseDailyCrucible,
            'wrathofthemachine': this.parseRaid,
            'nightfall': this.parseNightfall,
            'heroicstrike': this.parseHeroicStrikes,
            'weeklycrucible': this.parseWeeklyCrucible,
            'kingsfall': this.parseRaid
        };
    }

    bnet(relative) {
        if (relative) {
            return `https://www.bungie.net${relative}`;
        }
        return null;
    }

    getAdvisors() {
        let advisors = [];
        for (let activity in this.parsers) {
            let parser = this.parsers[activity];
            let result = this.parseActivity(
                this.activities[activity], parser.bind(this));
            if (result) {
                advisors.push(result);
            }
        }
        return advisors;
    }

    parseActivity(data, parser) {
        // is the data empty?
        if (!data) return null;

        // is this event inactive?
        let expiresAt = null;
        if (data && data.status) {
            let status = data.status;
            //if (!status.active) return null;
            if (status.expirationKnown) {
                expiresAt = status.expirationDate;
            }
        }

        // parse result
        let result = parser(data);
        if (result) {
            result.expiresAt = expiresAt;
            result.category = result.category || 'Activities';
            result.name = result.name || 'Unknown Activity';
        }
        return result;
    }

    parseXur(data) {
        return null;
    }

    parseTrials(data) {
        if (!data.display) return null;
        return {
            name: data.display.flavor,
            image: this.bnet(data.display.image)
        };
    }

    parseDailyStory(data) {
        if (!data.display) return null;

        let activity = this.manifest.getActivity(data.display.activityHash);
        return {
            name: activity ? activity.activityName : null,
            image: this.bnet(data.display.image)
        };
    }

    parseDailyCrucible(data) {
        if (!data.display) return null;

        let activity = this.manifest.getActivity(data.display.activityHash);
        return {
            name: activity ? activity.activityName : null,
        };
    }

    parseModifiers(category) {
        if (category && category.skulls) {
            return category.skulls.map(skull => {
                return {
                    name: skull.displayName,
                    icon: this.bnet(skull.icon)
                };
            });
        }
        return null;
    }

    parseChallengeModes(tiers) {
        if (tiers) {
            // use Normal mode so we don't get the Heroic modifier
            let normalTier = tiers.find(
                t => t.tierDisplayName === "Normal");
            if (normalTier && normalTier.skullCategories) {
                let category = normalTier.skullCategories.find(
                    c => c.title === "Modifiers");
                return this.parseModifiers(category);
            }
        }
        return null;
    }

    parseRaid(data) {
        return {
            modifiers: this.parseChallengeModes(data.activityTiers)
        };
    }

    parseNightfall(data) {
        if (!data.display) return null;

        let activity = this.manifest.getActivity(data.display.activityHash);
        let modifiers = null;
        if (data.extended && data.extended.skullCategories) {
            let category = data.extended.skullCategories.find(
                c => c.title === "Modifiers");
            modifiers = this.parseModifiers(category);
        }

        return {
            name: activity ? activity.activityName : null,
            image: this.bnet(data.display.image),
            modifiers: modifiers
        };
    }

    parseHeroicStrikes(data) {
        let modifiers = null;
        if (data.extended && data.extended.skullCategories) {
            let category = data.extended.skullCategories.find(
                c => c.title === "Modifiers");
            modifiers = this.parseModifiers(category);
        }
        return {
            modifiers: modifiers
        };
    }

    parseWeeklyCrucible(data) {
        if (!data.display) return null;

        let activity = this.manifest.getActivity(data.display.activityHash);
        return {
            name: activity ? activity.activityName : null,
        };
    }
};