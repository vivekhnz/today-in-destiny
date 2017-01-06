import { getCurrencies } from './build/services/parsers.js';
import { CURRENCIES } from './build/services/parsers/rewards.js';

export function verifyManifest() {
    // verify icons are defined for all used currencies
    let currencies = getCurrencies();
    currencies.forEach(currency => {
        let icon = CURRENCIES[currency];
        if (!icon) {
            console.log(`No currency icon was defined for ${currency}`);
        }
    }, this);
}