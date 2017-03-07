import fetch from 'isomorphic-fetch';
import urlJoin from 'url-join';

export default class Api {
    constructor(host) {
        this.host = host;
    }

    data() {
        return fetch(urlJoin(this.host, 'data'))
        .then(data => data.json());
    }

    resourceLink(path) {
        return urlJoin(this.host, 'resource', path);
    }
}
