export default class HttpHelper {

    constructor (endpoint) {
        this._endpoint = endpoint;
    }

    postData (data) {
        return new Promise( (resolve, reject) => {
            const req = new XMLHttpRequest();
            req.open('POST', this._endpoint);
            req.setRequestHeader('Content-Type', 'application/json');
            req.onreadystatechange = () => {
                if (req.readyState === 4) {
                    const data = {
                        status: req.status,
                        data: req.response
                    }
                    req.status >= 200 && req.status < 300 ? resolve(data) : reject(data);
                }
            }
            req.responseType = 'json';
            req.send(JSON.stringify(data));
        });
    }

    postDataSync (data) {
        const req = new XMLHttpRequest();
        req.open('POST', this._endpoint, false);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(data));
    }
}


