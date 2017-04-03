const STRIKE_SPECIFIC_LOOT = {
    blightedChalice: {
        strikes: ['Blighted Chalice'],
        items: [3872841536]
    },
    cerberusVaeIII: {
        strikes: ['Cerberus Vae III'],
        items: [4049432596]
    },
    dustPalace: {
        strikes: ['Dust Palace'],
        items: [4049432596, 2620256215, 2620256212, 2620256213]
    },
    echoChamber: {
        strikes: ['Echo Chamber'],
        items: [3052681344, 790630350]
    },
    sepiksPrime: {
        strikes: ["The Devil's Lair", 'Sepiks Perfected'],
        items: [1387145760, 2440643321]
    },
    shieldBrothers: {
        strikes: ['Shield Brothers'],
        items: [4049432596, 2862544759]
    },
    hiveAbomination: {
        strikes: ['The Summoning Pits', 'The Abomination Heist'],
        items: [1387145760, 1207988981]
    },
    nexus: {
        strikes: ['The Nexus'],
        items: [2405148796]
    },
    shadowThief: {
        strikes: ['The Shadow Thief'],
        items: [4118379255, 3556663880, 2620256214]
    },
    saber: {
        strikes: ['Fallen S.A.B.E.R.'],
        items: [3556663880, 2843928135]
    },
    sunlessCell: {
        strikes: ['The Sunless Cell'],
        items: [1865744636, 3848584870]
    },
    undyingMind: {
        strikes: ['The Undying Mind'],
        items: [3052681344, 1242830876]
    },
    willOfCrota: {
        strikes: ['The Will of Crota'],
        items: [4068577415, 290931251]
    },
    wretchedEye: {
        strikes: ['The Wretched Eye'],
        items: [1387145760, 3872841536, 149060560]
    },
    wintersRun: {
        strikes: ["Winter's Run"],
        items: [1994742696]
    }
};

export const REWARDS = {
    cruciblePostGameRewards: {
        name: 'Post-Game Rewards',
        items: [
            1936633101, 1258012244, 1132793057, 658685718,
            100397241, 1592913758, 3820351995, 3622856851,
            1287343925, 1042281685, 3071319006, 2816115592,
            3677466369, 1027613438
        ]
    },

    trialsFlawless: {
        name: 'Flawless Victory',
        items: [
            952225323,
            3366907657, 1398798172, 320170739, 3490124916,
            2601212255
        ]
    },
    trialsY3weapons: {
        name: 'Year 3 Weapons',
        items: [
            3366907656, 1398798173, 320170738, 3490124917,
            2904362064, 1232070660, 2968802931
        ]
    },
    trialsY3armor: {
        name: 'Year 3 Armor',
        items: [
            380709696, 2241750289, 3324900039, 1648442595, 4040397782,
            1176452006, 190411895, 1627572929, 1998946585, 2410077980,
            1059881049, 997700304, 1963125496, 1314758954, 741603733
        ]
    },
    trialsEquipment: {
        name: 'Equipment',
        items: [
            952225322, 664737061, 3017621394, 3017621393, 3017621392, 3017621395,
            3458902100, 4111350119, 4111350118, 4111350117,
            3043619339, 4150247778, 1960785498
        ]
    },
    trialsY2weapons: {
        name: 'Year 2 Weapons',
        items: [
            1173766590, 341708371, 48423572, 2748310063,
            1305525274, 1604125378, 2469233045,
            1505957929, 2321310309
        ]
    },
    trialsY2armor: {
        name: 'Year 2 Armor',
        items: [
            3273710512, 3071494145, 3461067991, 271372403, 1294420134,
            1149751883, 3342415802, 1811367950, 728377844, 2129462487,
            1971451038, 1937895859,

            3925936918, 835063271, 3452701201, 3882836265, 1353163820,
            2602145129, 10673376, 1705510184, 2959003546, 3407607557,
            3602716116, 3636271393,
            
            3128948233, 537476480, 3389932104, 3910264250, 1221519781,
            1278603962, 3515978627, 4184289357, 1566345525, 2339777344,
            3808465205, 3774909908,
        ]
    },

    'raid-vog-challenges': {
        name: 'Raid Challenges',
        items: [
            17215187, 17215186, 3974974481,
            2512322824, 3307602312, 1620583065, 1288233773
        ]
    },
    'raid-vog-weapons': {
        name: 'Weapons',
        items: [
            4113238754,
            2399369391, 1370460719, 306958364, 1456315384,
            1444401177, 3895707031, 3008445140,
            1458926430, 167916720
        ]
    },
    'raid-vog-armor': {
        name: 'Armor',
        items: [
            124508677, 905185492, 1696520940, 1151347422, 100312097,
            2696808257, 3534727768, 72887664, 1569892242, 3253433517,
            1913300516, 1477614333, 4208473987, 3801766431, 3107297018
        ]
    },
    'raid-vog-equipment': {
        name: 'Equipment',
        items: [
            407626698, 1050291910,
            3912672488, 671526060, 671526061, 1202967480,
            2810867465
        ]
    },

    'raid-crota-challenges': {
        name: 'Raid Challenges',
        items: [
            2727182628, 2727182629, 3974974481,
            3563445476, 4186638508, 3284317805, 3139712529
        ]
    },
    'raid-crota-weapons': {
        name: 'Weapons',
        items: [
            2228467481,
            3288685443, 504330683, 1090313784, 4025684900,
            297997397, 3227022822, 169290560,
            1771861810, 278511964
        ]
    },
    'raid-crota-armor': {
        name: 'Armor',
        items: [
            3048102613, 1723945892, 136219292, 3654591822, 1846613521,
            440236681, 2143732224, 23451592, 1221552698, 2150006565,
            3971460238, 1126257023, 925424697, 47507137, 2239590644
        ]
    },
    'raid-crota-equipment': {
        name: 'Equipment',
        items: [
            3269301481, 1906496743, 1906496742, 1050291911,
            3912672489, 3458901841, 3458901840, 845577225,
            2810867465
        ]
    },

    'raid-kf-challenges': {
        name: 'Raid Challenges',
        items: [
            2372257456, 2372257459, 2372257463, 885685675, 3974974481,
            1344441638, 162993472, 547597837, 690024325
        ]
    },
    'raid-kf-weapons': {
        name: 'Weapons',
        items: [
            3688594189,
            2744847861, 3242690679, 974535320, 856822016,
            457366421, 1631737897, 1565163446,
            3752225442, 189063458
        ]
    },
    'raid-kf-armor': {
        name: 'Armor',
        items: [
            191736999, 3500664182, 4219383232, 1014231576, 706920989,
            1973841835, 1979402994, 299972636, 1714356932, 1761960529,
            4027080268, 384778813, 3870751653, 4065554759, 319614456
        ]
    },
    'raid-kf-equipment': {
        name: 'Equipment',
        items: [
            2372257458, 2372257457, 3176299289, 3176299291, 202245945, 1050291904,
            3912672490, 2227954477,
            2810867465
        ]
    },

    'raid-wotm-challenges': {
        name: 'Raid Challenges',
        items: [
            185564351, 185564350, 2634463554, 3974974481,
            1665465325, 4274184111, 46152726, 2706628142
        ]
    },
    'raid-wotm-weapons': {
        name: 'Weapons',
        items: [
            3742521821,
            621603243, 3632330099, 2542033072, 2154053164,
            2125403517, 2001493563, 3598793896, 3569444312,
            1784034858, 242628276
        ]
    },
    'raid-wotm-armor': {
        name: 'Armor',
        items: [
            661529958, 2903199471, 1823306243, 691310313, 1047302226,
            3138343136, 3976262649, 307172369, 2011530291, 3529294924,
            1299613399, 2503707046, 2679967696, 1680970216, 155972845
        ]
    },
    'raid-wotm-equipment': {
        name: 'Equipment',
        items: [
            185564349, 185564348, 185564345, 898062439, 898062438, 1050291905,
            2436994447, 2436994446, 3011919237, 2227954476,
            730655315,
            2810867465
        ]
    },

    strikeHoardChests: {
        name: 'Strike Hoard Chests',
        items: combineStrikeSpecificLoot()
    }
};
for (const strike in STRIKE_SPECIFIC_LOOT) {
    const loot = STRIKE_SPECIFIC_LOOT[strike];
    REWARDS[`strike-${strike}`] = {
        name: 'Strike Hoard Chest',
        items: loot.items
    };
}

function combineStrikeSpecificLoot() {
    const output = [];
    for (const strike in STRIKE_SPECIFIC_LOOT) {
        const loot = STRIKE_SPECIFIC_LOOT[strike];
        loot.items.forEach(item => {
            if (!output.includes(item)) {
                output.push(item);
            }
        }, this);
    }
    return output;
}

export function getStrikeLoot(strikeName) {
    const output = [];
    for (const strike in STRIKE_SPECIFIC_LOOT) {
        const loot = STRIKE_SPECIFIC_LOOT[strike];
        if (loot.strikes.includes(strikeName)) {
            return `strike-${strike}`;
        }
    }
    return undefined;
}

export const CURRENCIES = {
    'Unknown Rewards': 'unknown.jpg',
    'Legendary Marks': 'legendaryMarks.png',
    'Skeleton Key': 'skeletonKey.jpg',
    'Treasure of the Ages': 'agesTreasure.png'
};