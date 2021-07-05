export default class Source<T extends IModel<T>> implements ISource<T> {
    private _owner;
    private readonly _connection;
    private readonly _adapter;
    private readonly _schema;
    get connection(): IConnection;
    get adapter(): IAdapter;
    get schema(): ISchema;
    get owner(): T | undefined;
    set owner(s: T | undefined);
    constructor(connection: IConnection, adapter: IAdapter, schema: ISchema);
    fetch(query: IQuery<T>, args: object): AsyncGenerator<object, void, void>;
}
//# sourceMappingURL=source.d.ts.map