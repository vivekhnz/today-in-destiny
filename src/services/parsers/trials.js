import {bnet} from './utils';

export default {
    activities: ['trials'],
    parser: ({activities, manifest}) => {
        let output = {
            category: 'events',
            image: "/images/advisors/backgrounds/trials.jpg",
            icon: "/images/advisors/icons/trials.png"
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