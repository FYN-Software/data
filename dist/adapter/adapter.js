export default class Adapter {
    static defaultConfig = {
        async *from(d) {
            yield* d;
        },
        async *to(d) {
            yield* d;
        },
    };
    _from;
    _to;
    _source;
    get source() {
        return this._source;
    }
    set source(s) {
        this._source = s;
    }
    constructor({ from, to } = Adapter.defaultConfig) {
        this._from = from;
        this._to = to;
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
