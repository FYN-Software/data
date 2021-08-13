import Stream from '@fyn-software/core/stream';
export default class Source {
    _owner;
    _connection;
    _adapter;
    _schema;
    get connection() {
        return this._connection;
    }
    get adapter() {
        return this._adapter;
    }
    get schema() {
        return this._schema;
    }
    get owner() {
        return this._owner;
    }
    set owner(s) {
        if (s === undefined) {
            throw new Error(`expected and instance of a model, got 'undefined' instead`);
        }
        this._owner = s;
    }
    constructor(connection, adapter, schema) {
        this._connection = connection;
        this._adapter = adapter;
        this._schema = schema;
        connection.source = this;
        adapter.source = this;
        schema.source = this;
    }
    async *fetch(query, args) {
        yield* Stream.from(await this._schema.prepare(query, args))
            .pipe(this._connection.fetch, args)
            .pipe(this._adapter.from)
            .pipe(this._schema.map);
    }
}
