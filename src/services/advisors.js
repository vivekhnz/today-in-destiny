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
        if (data && data.status && !data.status.active) {
            return null;
        }

        return parser(data);
    }

    parseXur(data) {
        return {
            category: "Events",
            type: "Agent of the Nine",
            name: "Xûr has arrived...",
            icon: "https://www.bungie.net/img/destiny_content/events/xur_icon.png",
            image: "https://www.bungie.net/img/theme/bungienet/bgs/bg_xuravailable.jpg",
            timeRemaining: "22h 23m",
            items: [
                { name: "Hard Light", icon: "https://www.bungie.net/common/destiny_content/icons/5b503f30ffed95cb2bd52a101bfcb40c.jpg" },
                { name: "An Insurmountable Skullfort", icon: "https://www.bungie.net/common/destiny_content/icons/96a1d50529b001fbfc66430fabec3ae4.jpg" },
                { name: "Young Ahamkara's Spine", icon: "https://www.bungie.net/common/destiny_content/icons/a9fe5de19d226aae51477e85107a9dd4.jpg" },
                { name: "Apotheosis Veil", icon: "https://www.bungie.net/common/destiny_content/icons/51019cde47738f13801725caed9fd43e.jpg" },
                { name: "Three of Coins", icon: "https://www.bungie.net/common/destiny_content/icons/8852eeb0093a6effba7f1c90022da0ef.jpg" }
            ]
        };
    }

    parseTrials(data) {
        return {
            category: "Events",
            type: "Trials of Osiris",
            name: "The Burning Shrine",
            icon: "https://www.bungie.net/img/theme/destiny/icons/osiris_diamond.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/crucible_the_burning_shrine.jpg",
            timeRemaining: "2d 22h 23m"
        };
    }

    parseDailyStory(data) {
        return {
            category: "Today",
            type: "Daily Story Mission",
            name: "Enemy of My Enemy",
            icon: "https://www.bungie.net/img/theme/destiny/icons/node_story_featured.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/enemy_of_my_enemy.jpg",
            timeRemaining: "22h 23m"
        };
    }

    parseDailyCrucible(data) {
        return {
            category: "Today",
            type: "Daily Crucible Playlist",
            name: "Control",
            icon: "https://www.bungie.net/img/destiny_content/advisors/pvp_Control.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/daily_crucible.jpg",
            timeRemaining: "22h 23m"
        };
    }

    parseWrathOfTheMachine(data) {
        return {
            category: "This Week",
            type: "Raid",
            name: "Wrath of the Machine",
            icon: "https://www.bungie.net/common/destiny_content/icons/08142310168ad6ade9a6e4252e8433fc.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/wrath_of_the_machine.jpg",
            timeRemaining: "2d 22h 23m",
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
            timeRemaining: "2d 22h 23m",
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
            timeRemaining: "2d 22h 23m",
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
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/weekly_crucible.jpg",
            timeRemaining: "2d 22h 23m"
        };
    }

    parseKingsFall(data) {
        return {
            category: "This Week",
            type: "Raid",
            name: "King's Fall",
            icon: "https://www.bungie.net/common/destiny_content/icons/08142310168ad6ade9a6e4252e8433fc.png",
            image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/kings_fall.jpg",
            timeRemaining: "2d 22h 23m",
            modifiers: [
                { name: "Warpriest Challenge", icon: "https://www.bungie.net/common/destiny_content/icons/9aa0b2f21752ff761c93c647aabf2bb9.png" },
            ]
        };
    }
};