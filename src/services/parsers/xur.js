export default {
    activities: ['xur'],
    optionalVendors: ['xur'],
    featuredItems: {
        vendor: 'xur',
        category: 'Exotic Gear'
    },
    parser: () => {
        return {
            category: 'events',
            shortID: 'xur',
            type: 'Agent of the Nine',
            name: 'Xûr has arrived...',
            image: "/images/advisors/backgrounds/xur.jpg",
            icon: "/images/advisors/icons/xur.png"
        };
    }
};