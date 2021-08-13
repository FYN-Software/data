export default class Connection {
    _source;
    get source() {
        return this._source;
    }
    set source(s) {
        this._source = s;
    }
    constructor() {
    }
    async *fetch(query, args = {}) {
    }
    static get default() {
        return class extends this {
        };
    }
}
