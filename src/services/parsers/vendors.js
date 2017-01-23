export let parseIronLordArtifacts = {
    vendors: ['tyra'],
    featuredItems: {
        vendor: 'tyra',
        category: 'Iron Lord Artifacts'
    },
    parser: () => {
        return {
            category: 'weekly',
            type: 'Tyra Karn',
            name: 'Iron Lord Artifacts',
            image: "/images/advisors/backgrounds/ironTemple.jpg",
            icon: "/images/advisors/icons/cryptarch.png"
        };
    }
};

export let parseShiro = {
    vendors: ['shiro'],
    featuredItems: {
        vendor: 'shiro',
        category: 'Armor'
    },
    parser: () => {
        return {
            category: 'weekly',
            type: 'Shiro-4',
            name: 'Vanguard Scout',
            image: "/images/advisors/backgrounds/felwinterPeak.jpg",
            icon: "/images/advisors/icons/vanguard.png"
        };
    }
};