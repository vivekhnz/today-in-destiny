export default {
    shortID: 'ironBanner',
    activities: ['ironbanner'],
    optionalVendors: ['efrideet'],
    featuredItems: {
        vendor: 'efrideet',
        category: 'Event Rewards'
    },
    parser: ({activities, manifest}) => {
        let output = {
            category: 'events',
            name: 'Iron Banner',
            type: 'Limited Time Event',
            image: "/images/advisors/backgrounds/ironBanner.jpg",
            icon: "/images/advisors/icons/ironBanner.png"
        };

        // obtain Iron Banner playlist
        if (activities.weeklycrucible && activities.weeklycrucible.display) {
            let activity = manifest.getActivity(
                activities.weeklycrucible.display.activityHash);
            if (activity) {
                output.name = activity.activityName.replace(
                    "Iron Banner", "").trim();
                output.type = 'Iron Banner';
            }
        }

        return output;
    }
};