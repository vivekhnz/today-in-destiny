export default class AdvisorsService {
    constructor(activities) {
        this.activities = activities;
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
                this.activities[activity], parser);
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
        return {
            category: "Today",
            type: "Daily Story Mission",
            name: "Enemy of My Enemy",
            icon: "https://www.bungie.net/img/theme/destiny/icons/node_story_featured.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/enemy_of_my_enemy.jpg"
        };
    }

    parseDailyCrucible(data) {
        return {
            category: "Today",
            type: "Daily Crucible Playlist",
            name: "Control",
            icon: "https://www.bungie.net/img/destiny_content/advisors/pvp_Control.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/daily_crucible.jpg"
        };
    }

    parseWrathOfTheMachine(data) {
        return {
            category: "This Week",
            type: "Raid",
            name: "Wrath of the Machine",
            icon: "https://www.bungie.net/common/destiny_content/icons/08142310168ad6ade9a6e4252e8433fc.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/wrath_of_the_machine.jpg",
            modifiers: [
                { name: "Vosik Challenge", icon: "https://www.bungie.net/common/destiny_content/icons/d500171b589479f145964a2bc1d7036b.png" }
            ]
        };
    }

    parseNightfall(data) {
        return {
            category: "This Week",
            type: "Nightfall Strike",
            name: "The Wretched Eye",
            icon: "https://www.bungie.net/img/theme/destiny/icons/node_strike_nightfall.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/wretched_eye.jpg",
            modifiers: [
                { name: "Epic", icon: "https://www.bungie.net/common/destiny_content/icons/1db70c6734dffce9ee6cb4792da26c81.png" },
                { name: "Arc Burn", icon: "https://www.bungie.net/img/destiny_content/scripted_skulls/skull_damage_boost_arc_000_001.v2.png" },
                { name: "Brawler", icon: "https://www.bungie.net/img/destiny_content/scripted_skulls/skull_brawler_000_001.v2.png" },
                { name: "Ironclad", icon: "https://www.bungie.net/common/destiny_content/icons/fc7b47af0ec6acc1558fed7e46714fc2.png" },
                { name: "Exposure", icon: "https://www.bungie.net/img/destiny_content/scripted_skulls/skull_morbid_000_001.v2.png" }
            ]
        };
    }

    parseHeroicStrikes(data) {
        return {
            category: "This Week",
            type: "Heroic Strike Playlist",
            name: "SIVA Crisis Heroic",
            icon: "https://www.bungie.net/img/theme/destiny/icons/node_strike_featured.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/weekly_heroic.jpg",
            modifiers: [
                { name: "Heroic", icon: "https://www.bungie.net/common/destiny_content/icons/b070b353fc2b3067a84dad54f20da48b.png" },
                { name: "Specialist", icon: "https://www.bungie.net/img/destiny_content/scripted_skulls/skull_specialist_000_001.v2.png" },
                { name: "Exposure", icon: "https://www.bungie.net/img/destiny_content/scripted_skulls/skull_morbid_000_001.v2.png" },
                { name: "Airborne", icon: "https://www.bungie.net/img/destiny_content/scripted_skulls/skull_airborne_000_001.v2.png" },
            ]
        };
    }

    parseWeeklyCrucible(data) {
        return {
            category: "This Week",
            type: "Weekly Crucible Playlist",
            name: "Inferno Supremacy",
            icon: "https://www.bungie.net/common/destiny_content/icons/203b106719909523844384cb4e2cae1f.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/weekly_crucible.jpg"
        };
    }

    parseKingsFall(data) {
        return {
            category: "This Week",
            type: "Raid",
            name: "King's Fall",
            icon: "https://www.bungie.net/common/destiny_content/icons/08142310168ad6ade9a6e4252e8433fc.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/kings_fall.jpg",
            modifiers: [
                { name: "Warpriest Challenge", icon: "https://www.bungie.net/common/destiny_content/icons/9aa0b2f21752ff761c93c647aabf2bb9.png" },
            ]
        };
    }
};