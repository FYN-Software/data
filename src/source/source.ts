import Stream from '@fyn-software/core/stream';

export default class Source<T extends IModel<T>> implements ISource<T>
{
    private _owner: T|undefined;
    private readonly _connection: IConnection;
    private readonly _adapter: IAdapter;
    private readonly _schema: ISchema;

    get connection(): IConnection
    {
        return this._connection;
    }
    get adapter(): IAdapter
    {
        return this._adapter;
    }
    get schema(): ISchema
    {
        return this._schema;
    }

    get owner(): T|undefined
    {
        return this._owner;
    }

    set owner(s: T|undefined)
    {
        if(s === undefined)
        {
            throw new Error(`expected and instance of a model, got 'undefined' instead`);
        }

        this._owner = s;
    }

    public constructor(connection: IConnection, adapter: IAdapter, schema: ISchema)
    {
        this._connection = connection;
        this._adapter = adapter;
        this._schema = schema;

        connection.source = this;
        adapter.source = this;
        schema.source = this;
    }

    async *fetch(query: IQuery<T>, args: object): AsyncGenerator<object, void, void>
    {
        yield* Stream.from(await this._schema.prepare(query, args))
            .pipe(this._connection.fetch, args)
            .pipe(this._adapter.from)
            .pipe(this._schema.map);
    }
}