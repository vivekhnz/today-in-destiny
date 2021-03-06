import { bnet } from './utils';

export default {
    shortID: 'trials',
    activities: ['trials'],
    parser: ({activities, manifest}) => {
        let output = {
            category: 'events',
            image: "/images/advisors/backgrounds/trials.jpg",
            icon: "/images/advisors/icons/trials.png",
            rewardSets: [
                'trialsFlawless',
                'trialsY3weapons', 'trialsY3armor', 'trialsEquipment',
                'trialsY2weapons', 'trialsY2armor'
            ]
        };
        if (activities.trials.display) {
            output.name = activities.trials.display.flavor;
            output.type = 'Trials of Osiris';
            output.image = bnet(activities.trials.display.image);
        }
        else {
            output.name = 'Trials of Osiris';
            output.type = 'Limited Time Event';
        }
        return output;
    }
};