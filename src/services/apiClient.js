import { endpoints } from '../routes';

class APIClient {
    get(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = () => {
                try {
                    let response = JSON.parse(xhr.responseText);
                    if (xhr.status === 200) {
                        resolve(response.response);
                    }
                    else {
                        reject(new Error(response.status));
                    }
                } catch (error) {
                    reject(new Error('An error occured.'));
                }
            };
            xhr.send();
        });
    }

    endpoint(endpoint, params) {
        let url = endpoint;
        for (let param in params) {
            url = url.replace(`:${param}`, params[param]);
        }
        return new Promise((resolve, reject) => {
            this.get(url)
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }

    getAdvisors() { return this.endpoint(endpoints.advisors); }
    getSingleAdvisor(id) { return this.endpoint(endpoints.singleAdvisor, { id: id }); }
};

export default new APIClient();