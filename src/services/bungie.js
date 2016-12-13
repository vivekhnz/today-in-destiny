import request from 'request';

class BungiePlatformService {
    get(endpoint) {
        let options = {
            url: `https://www.bungie.net/Platform${endpoint}`,
            headers: {
                'X-API-Key': process.env.BUNGIE_API_KEY
            }
        };
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                try {
                    if (error || response.statusCode !== 200) {
                        throw error;
                    }
                    let data = JSON.parse(body);
                    if (data.ErrorCode === 1) {
                        resolve(data.Response);
                    }
                    else {
                        throw new Error(`${data.ErrorStatus}: ${data.Message}`);
                    }
                } catch (e) {
                    reject(new Error(`Bungie.net Error: ${e.message}`));
                }
            });
        });
    }

    getPublicAdvisorsV2() {
        return this.get('/Destiny/Advisors/V2/?definitions=true');
    }

    getXur() {
        return this.get('/Destiny/Advisors/Xur/?definitions=true');
    }

    getVendor(vendorHash) {
        return this.get(`/Destiny/Vendors/${vendorHash}/?definitions=true`);
    }
};

export default new BungiePlatformService();