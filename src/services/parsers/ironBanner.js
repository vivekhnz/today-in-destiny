import {bnet, parseItems} from './utils';

export default {
    activities: ['ironbanner'],
    parser: ({activities, vendors, manifest}) => {
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

        // obtain vendor stock
        if (vendors.ironBanner && vendors.ironBanner.stock) {
            output.items = parseItems(
                vendors.ironBanner.stock['Event Rewards'], manifest);
        }

        return output;
    }
};