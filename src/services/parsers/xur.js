import {parseItems} from './utils';

export default {
    activities: ['xur'],
    optionalVendors: ['xur'],
    parser: ({activities, vendors, manifest}) => {
        // obtain Xur's stock 
        let items = null;
        if (vendors.xur && vendors.xur.stock) {
            items = parseItems(
                vendors.xur.stock['Exotic Gear'], manifest);
        }
        
        return {
            category: 'events',
            type: 'Agent of the Nine',
            name: 'Xûr has arrived...',
            image: "/images/advisors/backgrounds/xur.jpg",
            icon: "/images/advisors/icons/xur.png",
            items: items
        };
    }
};