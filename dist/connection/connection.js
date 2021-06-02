export default class Connection {
    constructor() {
    }
    get source() {
        return this._source;
    }
    set source(s) {
        this._source = s;
    }
    async *fetch(query, args = {}) {
    }
    static get default() {
        return class extends this {
        };
    }
}
