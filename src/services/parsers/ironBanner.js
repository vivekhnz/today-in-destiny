import {bnet, parseItems} from './utils';

export default {
    activities: ['ironbanner'],
    optionalVendors: ['efrideet'],
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
        if (vendors.efrideet && vendors.efrideet.stock) {
            output.items = parseItems(
                vendors.efrideet.stock['Event Rewards'], manifest);
        }

        return output;
    }
};