export default class Adapter {
    constructor({ from, to } = Adapter.defaultConfig) {
        this._from = from;
        this._to = to;
    }
    get source() {
        return this._source;
    }
    set source(s) {
        this._source = s;
    }
    async *from(data) {
        yield* this._from(data);
    }
    async *to(data) {
        yield* this._to(data);
    }
    compile(query) {
        return query;
    }
    static get default() {
        return class extends this {
        };
    }
}
Adapter.defaultConfig = {
    async *from(d) {
        yield* d;
    },
    async *to(d) {
        yield* d;
    },
};
