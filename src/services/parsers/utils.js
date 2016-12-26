export function bnet(relative) {
    if (relative
        && relative !== '/img/theme/destiny/bgs/pgcrs/placeholder.jpg') {
        return `https://www.bungie.net${relative}`
    };
    return null;
}

export function parseItems(category, manifest) {
    if (category) {
        let items = [];
        let hashes = [];

        category.forEach(item => {
            // don't show the same item more than once
            if (!hashes.includes(item.itemHash)) {
                hashes.push(item.itemHash);
                let definition = manifest.getItem(item.itemHash);
                if (definition) {
                    items.push({
                        name: definition.itemName,
                        icon: bnet(definition.icon)
                    });
                }
            }
        }, this);
        return items;
    }
    return null;
}

export function parseModifiers(category) {
    if (category && category.skulls) {
        return category.skulls.map(skull => {
            return {
                name: skull.displayName,
                icon: bnet(skull.icon)
            };
        });
    }
    return null;
}