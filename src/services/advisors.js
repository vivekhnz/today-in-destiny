export default class AdvisorsService {
    constructor(activities, manifest) {
        this.activities = activities;
        this.manifest = manifest;
        this.parsers = {
            'xur': this.parseXur,
            'trials': this.parseTrials,
            'dailychapter': this.parseDailyStory,
            'dailycrucible': this.parseDailyCrucible,
            'wrathofthemachine': this.parseWrathOfTheMachine,
            'nightfall': this.parseNightfall,
            'heroicstrike': this.parseHeroicStrikes,
            'weeklycrucible': this.parseWeeklyCrucible,
            'kingsfall': this.parseKingsFall
        };
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
            if (!status.active) return null;
            if (status.expirationKnown) {
                expiresAt = status.expirationDate;
            }
        }

        // parse result
        let result = parser(data);
        if (result) {
            result.expiresAt = expiresAt;
        }
        return result;
    }

    parseXur(data) {
        return null;
    }

    parseTrials(data) {
        if (!data.display) return null;
        let map = data.display.flavor || "Unknown Map";
        let mapImage = data.display.image || "/img/theme/destiny/bgs/pgcrs/TrialsDefault.jpg";
        return {
            category: "Events",
            type: "Trials of Osiris",
            name: data.display.flavor || "Unknown Map",
            icon: "https://www.bungie.net/img/theme/destiny/icons/osiris_diamond.png",
            image: `https://www.bungie.net${mapImage}`
        };
    }

    parseDailyStory(data) {
        if (!data.display) return null;
        
        // get mission name
        let mission = 'Unknown Mission';
        let activity = this.manifest.getActivity(data.display.activityHash);
        if (activity && activity.activityName) {
            mission = activity.activityName;
        }

        let image = null;
        if (data.display.image) {
            image = `https://www.bungie.net${data.display.image}`;
        }
        return {
            category: "Today",
            type: "Daily Story Mission",
            name: mission,
            icon: "https://www.bungie.net/img/theme/destiny/icons/node_story_featured.png",
            image: image
        };
    }

    parseDailyCrucible(data) {
        if (!data.display) return null;

        // get playlist name and icon
        let playlist = 'Unknown Playlist';
        let icon = data.display.icon || '/img/theme/destiny/icons/node_pvp_featured.png';
        let activity = this.manifest.getActivity(data.display.activityHash);
        if (activity) {
            playlist = activity.activityName || playlist;
            icon = activity.icon || icon;
        }

        return {
            category: "Today",
            type: "Daily Crucible Playlist",
            name: playlist,
            icon: `https://www.bungie.net${icon}`,
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/daily_crucible.jpg"
        };
    }

    parseModifiers(category) {
        if (category && category.skulls) {
            return category.skulls.map(skull => {
                return {
                    name: skull.displayName,
                    icon: `https://www.bungie.net${skull.icon}`
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

    parseWrathOfTheMachine(data) {
        let modifiers = this.parseChallengeModes(data.activityTiers);
        return {
            category: "This Week",
            type: "Raid",
            name: "Wrath of the Machine",
            icon: "https://www.bungie.net/common/destiny_content/icons/08142310168ad6ade9a6e4252e8433fc.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/wrath_of_the_machine.jpg",
            modifiers: modifiers
        };
    }

    parseNightfall(data) {
        if (!data.display) return null;
        
        // get mission name
        let mission = 'Unknown Mission';
        let activity = this.manifest.getActivity(data.display.activityHash);
        if (activity && activity.activityName) {
            mission = activity.activityName;
        }

        let image = null;
        if (data.display.image) {
            image = `https://www.bungie.net${data.display.image}`;
        }
        let modifiers = null;
        if (data.extended && data.extended.skullCategories) {
            let category = data.extended.skullCategories.find(
                c => c.title === "Modifiers");
            modifiers = this.parseModifiers(category);
        }
        return {
            category: "This Week",
            type: "Nightfall Strike",
            name: mission,
            icon: "https://www.bungie.net/img/theme/destiny/icons/node_strike_nightfall.png",
            image: image,
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
            category: "This Week",
            type: "Heroic Strike Playlist",
            name: "SIVA Crisis Heroic",
            icon: "https://www.bungie.net/img/theme/destiny/icons/node_strike_featured.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/weekly_heroic.jpg",
            modifiers: modifiers
        };
    }

    parseWeeklyCrucible(data) {
        if (!data.display) return null;
        
        // get playlist name and icon
        let playlist = 'Unknown Playlist';
        let icon = data.display.icon || '/img/destiny_content/advisors/pvp_Weekly_PvP.png';
        let activity = this.manifest.getActivity(data.display.activityHash);
        if (activity) {
            playlist = activity.activityName || playlist;
            icon = activity.icon || icon;
        }

        return {
            category: "This Week",
            type: "Weekly Crucible Playlist",
            name: playlist,
            icon: `https://www.bungie.net${icon}`,
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/weekly_crucible.jpg"
        };
    }

    parseKingsFall(data) {
        let modifiers = this.parseChallengeModes(data.activityTiers);
        return {
            category: "This Week",
            type: "Raid",
            name: "King's Fall",
            icon: "https://www.bungie.net/common/destiny_content/icons/08142310168ad6ade9a6e4252e8433fc.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/kings_fall.jpg",
            modifiers: modifiers
        };
    }
};