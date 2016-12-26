import {parseItems} from './utils';

export let parseIronLordArtifacts = {
    vendors: ['cryptarchIronTemple'],
    parser: ({vendors, manifest}) => {
        let artifacts = vendors.cryptarchIronTemple.stock['Iron Lord Artifacts'];
        return {
            category: 'weekly',
            type: 'Tyra Karn',
            name: 'Iron Lord Artifacts',
            image: "/images/advisors/backgrounds/ironTemple.jpg",
            icon: "/images/advisors/icons/cryptarch.png",
            items: parseItems(artifacts, manifest)
        };
    }
};

export let parseShiro = {
    vendors: ['vanguardIronTemple'],
    parser: ({vendors, manifest}) => {
        let classItems = vendors.vanguardIronTemple.stock['Armor'];
        return {
            category: 'weekly',
            type: 'Shiro-4',
            name: 'Vanguard Scout',
            image: "/images/advisors/backgrounds/felwinterPeak.jpg",
            icon: "/images/advisors/icons/vanguard.png",
            items: parseItems(classItems, manifest)
        };
    }
};