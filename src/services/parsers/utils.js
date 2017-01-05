let CURRENCIES = {
    'Unknown Rewards': 'unknown.jpg',
    'Legendary Marks': 'legendaryMarks.png',
    'Legendary Engram': 'engram.jpg',
    'Skeleton Key': 'skeletonKey.jpg',
    'Radiant Treasure': 'radiantTreasure.jpg',
    'Treasures of the Dawning': 'dawningTreasure.jpg'
};

export function bnet(relative) {
    if (relative
        && relative !== '/img/theme/destiny/bgs/pgcrs/placeholder.jpg') {
        return `https://www.bungie.net${relative}`
    };
    return null;
}

export function parseModifiers(category) {
    if (category && category.skulls) {
        return category.skulls.map(skull => {
            return {
                name: skull.displayName,
                icon: bnet(skull.icon),
                description: skull.description
            };
        });
    }
    return null;
}

export function currency(name, maxQuantity, perCompletion = undefined) {
    let icon = CURRENCIES[name];
    if (!icon) {
        icon = 'unknown.jpg';
    }
    return {
        name: name,
        quantity: maxQuantity,
        perCompletion: perCompletion,
        icon: `/images/items/currencies/${icon}`
    };
}