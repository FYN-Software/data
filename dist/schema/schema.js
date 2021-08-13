export default class Schema {
    _source;
    get source() {
        return this._source;
    }
    set source(s) {
        this._source = s;
    }
    constructor() {
    }
    async prepare(query, args = {}) {
        return query;
    }
    async *map(data) {
        yield* data;
    }
    static get default() {
        return class extends this {
        };
    }
}
