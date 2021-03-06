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
    return {
        name: name,
        quantity: maxQuantity,
        perCompletion: perCompletion
    };
}

export function copy(obj) {
    let output = {};
    for (let prop in obj) {
        output[prop] = obj[prop];
    }
    return output;
}