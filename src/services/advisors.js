export default class AdvisorsService {
    constructor(activities, manifest) {
        this.activities = activities;
        this.manifest = manifest;
        this.challengeModeBackgrounds = {
            'Golgoroth Challenge': 'golgoroth',
            'Oryx Challenge': 'oryx',
            'Vosik Challenge': 'vosik',
            'Aksis Challenge': 'aksis',
        };
        this.parsers = {
            'xur': {
                defaults: {
                    'category': 'Events',
                    'type': 'Agent of the Nine',
                    'name': 'Xûr has arrived...',
                    'image': "/images/advisors/backgrounds/xur.jpg",
                    'icon': "/images/advisors/icons/xur.png"
                },
                parser: this.parseXur
            },
            'trials': this.createEventParser('Trials of Osiris', 'trials', this.parseTrials),
            'ironbanner': this.createEventParser('Iron Banner', 'ironBanner', this.parseIronBanner),
            'dailychapter': {
                defaults: {
                    'category': 'Today',
                    'type': 'Daily Story Mission',
                    'name': 'Unknown Mission',
                    'image': "/images/advisors/backgrounds/default.jpg",
                    'icon': "/images/advisors/icons/dailyStory.png"
                },
                parser: this.parseDailyStory
            },
            'dailycrucible': {
                defaults: {
                    'category': 'Today',
                    'type': 'Daily Crucible Playlist',
                    'name': 'Unknown Playlist',
                    'image': "/images/advisors/backgrounds/dailyCrucible.jpg",
                    'icon': "/images/advisors/icons/dailyCrucible.png"
                },
                parser: this.parseDailyCrucible
            },
            'wrathofthemachine': this.createRaidParser(
                'Wrath of the Machine', 'wotm'),
            'nightfall': {
                defaults: {
                    'category': 'This Week',
                    'type': 'Nightfall Strike',
                    'name': 'Unknown Mission',
                    'image': "/images/advisors/backgrounds/nightfall.jpg",
                    'icon': "/images/advisors/icons/nightfall.png"
                },
                parser: this.parseNightfall
            },
            'heroicstrike': {
                defaults: {
                    'category': 'This Week',
                    'type': 'Heroic Strike Playlist',
                    'name': 'SIVA Crisis Heroic',
                    'image': "/images/advisors/backgrounds/heroicStrikes.jpg",
                    'icon': "/images/advisors/icons/heroicStrikes.png"
                },
                parser: this.parseHeroicStrikes
            },
            'weeklycrucible': {
                defaults: {
                    'category': 'This Week',
                    'type': 'Weekly Crucible Playlist',
                    'name': 'Unknown Playlist',
                    'image': "/images/advisors/backgrounds/weeklyCrucible.jpg",
                    'icon': "/images/advisors/icons/weeklyCrucible.png"
                },
                parser: this.parseWeeklyCrucible
            },
            'kingsfall': this.createRaidParser("King's Fall", 'kf')
        };
        this.defaults = {
            'category': 'Activities',
            'type': 'Featured Activity',
            'name': 'Unknown Activity',
            'image': '/images/advisors/backgrounds/default.jpg',
            'icon': '/images/advisors/icons/default.png'
        };
    }

    bnet(relative) {
        if (relative) return `https://www.bungie.net${relative}`;
        return null;
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
        let result = parser.parser.bind(this)(data);
        if (result) {
            result.expiresAt = expiresAt;

            // set any empty properties to default values for parser
            for (let prop in parser.defaults) {
                result[prop] = result[prop] || parser.defaults[prop];
            }

            // set any empty properties to default values
            for (let prop in this.defaults) {
                result[prop] = result[prop] || this.defaults[prop];
            }
        }
        return result;
    }

    parseXur(data) {
        return {};
    }

    createEventParser(name, identifier, parser) {
        return {
            defaults: {
                'category': 'Events',
                'type': name,
                'name': name,
                'image': `/images/advisors/backgrounds/${identifier}.jpg`,
                'icon': `/images/advisors/icons/${identifier}.png`
            },
            parser: data => {
                let parsed = parser.bind(this)(data);
                if (!parsed.name) {
                    parsed.name = name;
                    parsed.type = 'Limited Time Event';
                }
                return parsed;
            }
        };
    }

    parseTrials(data) {
        if (!data.display) return null;
        return {
            name: data.display.flavor,
            image: this.bnet(data.display.image)
        };
    }

    parseIronBanner(data) {
        let weeklyCrucible = this.activities.weeklycrucible;
        let playlist = null;

        // obtain playlist from Weekly Crucible Playlist
        if (weeklyCrucible && weeklyCrucible.display) {
            let activity = this.manifest.getActivity(
                weeklyCrucible.display.activityHash);
            if (activity) {
                playlist = activity.activityName.replace(
                    "Iron Banner", "").trim();
            }
        }
        return {
            name: playlist
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

    createRaidParser(name, identifier) {
        return {
            defaults: {
                'category': 'This Week',
                'type': 'Raid',
                'name': name,
                'image': `/images/advisors/backgrounds/raid-${identifier}.jpg`,
                'icon': `/images/advisors/icons/raid-${identifier}.png`
            },
            parser: data => {
                let modifiers = this.parseChallengeModes(data.activityTiers);
                let advisorName = null;
                let advisorType = null;
                let image = null;
                if (modifiers && modifiers.length === 1) {
                    advisorName = modifiers[0].name;
                    advisorType = name;
                    modifiers = null;
                    let bossID = this.challengeModeBackgrounds[advisorName];
                    if (bossID) {
                        image = `/images/advisors/backgrounds/raid-${identifier}-${bossID}.jpg`;
                    }
                }
                return {
                    name: advisorName,
                    type: advisorType,
                    modifiers: modifiers,
                    image: image
                };
            }
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
        let playlist = activity ? activity.activityName : null;

        // hide the weekly Crucible playlist if Iron Banner is active
        if (playlist && playlist.startsWith("Iron Banner")) {
            return null;
        }
        return {
            name: playlist,
        };
    }
};